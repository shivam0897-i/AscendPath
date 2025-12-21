import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Fetch users with email notifications enabled
        const { data: profiles, error: fetchError } = await supabase
            .from('profiles')
            .select('id, email, first_name, goal_role')
            .eq('email_notifications', true);

        if (fetchError) {
            console.error('Failed to fetch profiles:', fetchError);
            return res.status(500).json({ error: 'Failed to fetch profiles' });
        }

        if (!profiles || profiles.length === 0) {
            return res.status(200).json({ message: 'No users with notifications enabled', sent: 0 });
        }

        let sent = 0;
        let failed = 0;

        // Send emails to each user
        for (const profile of profiles) {
            if (!profile.email) continue;

            try {
                // Get user's progress stats
                const { count: completedMilestones } = await supabase
                    .from('milestones')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', profile.id)
                    .eq('completed', true);

                const { count: totalMilestones } = await supabase
                    .from('milestones')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', profile.id);

                const progress = totalMilestones && totalMilestones > 0
                    ? Math.round((completedMilestones || 0) / totalMilestones * 100)
                    : 0;

                const greeting = profile.first_name ? `Hi ${profile.first_name}` : 'Hi there';
                const goalText = profile.goal_role
                    ? `Your goal of becoming a ${profile.goal_role}`
                    : 'Your learning journey';
                const progressText = progress > 0
                    ? `You're ${progress}% of the way there!`
                    : "Let's make progress today!";

                await resend.emails.send({
                    from: 'AscendPath <noreply@ascendpath.xyz>',
                    to: profile.email,
                    subject: '🚀 Your Daily Learning Reminder from AscendPath',
                    html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #FAF7F2 0%, #fff 100%);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #C16E4B; margin: 0; font-size: 28px;">AscendPath</h1>
                <p style="color: #7C9082; margin: 5px 0;">Your Career Learning Journey</p>
              </div>
              
              <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(193, 110, 75, 0.1);">
                <h2 style="color: #2D2D2D; margin-top: 0;">${greeting}! 👋</h2>
                
                <p style="color: #555; line-height: 1.6; font-size: 16px;">
                  ${goalText} is progressing nicely. ${progressText}
                </p>
                
                <p style="color: #555; line-height: 1.6; font-size: 16px;">
                  You've completed ${completedMilestones || 0} milestones so far. Keep up the great work!
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://ascendpath.xyz/dashboard" 
                     style="display: inline-block; background: linear-gradient(135deg, #C16E4B 0%, #a85a3a 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Continue Learning →
                  </a>
                </div>
                
                <p style="color: #888; font-size: 14px; text-align: center; margin-bottom: 0;">
                  Small steps lead to big achievements. 🌟
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #999; font-size: 12px;">
                  You received this because you enabled learning reminders.<br>
                  <a href="https://ascendpath.xyz/profile" style="color: #C16E4B;">Manage preferences</a>
                </p>
              </div>
            </div>
          `,
                });

                sent++;
            } catch (emailError) {
                console.error(`Failed to send to ${profile.email}:`, emailError);
                failed++;
            }
        }

        return res.status(200).json({
            success: true,
            sent,
            failed,
            total: profiles.length
        });
    } catch (error) {
        console.error('Daily reminder cron error:', error);
        return res.status(500).json({ error: 'Cron job failed' });
    }
}
