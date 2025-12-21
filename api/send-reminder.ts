import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, goalRole, progress, completedMilestones } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const greeting = firstName ? `Hi ${firstName}` : 'Hi there';
    const goalText = goalRole ? `Your goal of becoming a ${goalRole}` : 'Your learning journey';
    const progressText = progress > 0 ? `You're ${progress}% of the way there!` : "Let's get started today!";
    const milestonesText = completedMilestones > 0
      ? `You've completed ${completedMilestones} milestones so far.`
      : 'Complete your first milestone today!';

    const { data, error } = await resend.emails.send({
      from: 'AscendPath <noreply@ascendpath.xyz>',
      to: email,
      subject: '🚀 Your Daily Learning Reminder from AscendPath',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #FAF7F2 0%, #fff 100%);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://ascendpath.xyz/logo.png" alt="AscendPath" style="width: 50px; height: 50px; margin-bottom: 10px;" />
            <h1 style="color: #C16E4B; margin: 0; font-size: 28px;">AscendPath</h1>
            <p style="color: #7C9082; margin: 5px 0;">Your Career Learning Journey</p>
          </div>
          
          <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(193, 110, 75, 0.1);">
            <h2 style="color: #2D2D2D; margin-top: 0;">${greeting}! 👋</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              ${goalText} is progressing nicely. ${progressText}
            </p>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              ${milestonesText} Keep up the great work!
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
              You received this because you enabled learning reminders on AscendPath.<br>
              <a href="https://ascendpath.xyz/profile" style="color: #C16E4B;">Manage preferences</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('Send reminder error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
