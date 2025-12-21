import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const greeting = firstName ? `Hi ${firstName}` : 'Welcome';

    const { data, error } = await resend.emails.send({
      from: 'AscendPath <noreply@ascendpath.xyz>',
      to: email,
      subject: '🎉 Welcome to AscendPath - Your Career Journey Starts Here!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #FAF7F2 0%, #fff 100%);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C16E4B; margin: 0; font-size: 32px;">AscendPath</h1>
            <p style="color: #7C9082; margin: 5px 0;">Your Career Learning Journey</p>
          </div>
          
          <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(193, 110, 75, 0.1);">
            <h2 style="color: #2D2D2D; margin-top: 0;">${greeting}! 🎉</h2>
            
            <p style="color: #555; line-height: 1.8; font-size: 16px;">
              Welcome to AscendPath! We're thrilled to have you join our community of learners on their path to career success.
            </p>
            
            <p style="color: #555; line-height: 1.8; font-size: 16px;">
              Here's what you can do to get started:
            </p>
            
            <div style="margin: 25px 0; padding: 20px; background: linear-gradient(135deg, rgba(193, 110, 75, 0.08) 0%, rgba(124, 144, 130, 0.08) 100%); border-radius: 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; vertical-align: middle; width: 40px;">
                    <div style="background: #C16E4B; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold;">1</div>
                  </td>
                  <td style="padding: 10px 0; color: #2D2D2D; font-weight: 500;">Take the Career Questionnaire</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; vertical-align: middle; width: 40px;">
                    <div style="background: #C16E4B; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold;">2</div>
                  </td>
                  <td style="padding: 10px 0; color: #2D2D2D; font-weight: 500;">Get Your AI-Powered Roadmap</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; vertical-align: middle; width: 40px;">
                    <div style="background: #C16E4B; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold;">3</div>
                  </td>
                  <td style="padding: 10px 0; color: #2D2D2D; font-weight: 500;">Start Learning & Track Progress</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ascendpath.xyz/Questionnaire" 
                 style="display: inline-block; background: linear-gradient(135deg, #C16E4B 0%, #a85a3a 100%); color: white; padding: 16px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Start Your Journey →
              </a>
            </div>
            
            <p style="color: #888; font-size: 14px; text-align: center; margin-bottom: 0;">
              We're here to help you every step of the way! 🚀
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">
              Questions? Just reply to this email!<br>
              <a href="https://ascendpath.xyz" style="color: #C16E4B;">ascendpath.xyz</a>
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
    console.error('Welcome email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
