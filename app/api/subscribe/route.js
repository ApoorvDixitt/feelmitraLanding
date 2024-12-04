import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, adminEmail, senderEmail } = await request.json();

    // Create a nodemailer transporter using Mailgun SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.MAILGUN_SMTP_USERNAME,
        pass: process.env.MAILGUN_SMTP_PASSWORD
      }
    });

    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: `Feel Mitra <${senderEmail}>`,
      to: email,
      subject: 'Welcome to Feel Mitra Newsletter!',
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAFAFA; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px 32px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="https://feelmitra.in/logo.png" alt="Feel Mitra Logo" style="width: 120px; height: auto;">
            </div>
            
            <h2 style="color: #EA580C; text-align: center; font-size: 24px; font-weight: 600; margin: 0 0 24px 0;">Welcome to Feel Mitra! 🎉</h2>
            
            <p style="color: #334155; line-height: 1.6; font-size: 16px; margin-bottom: 24px;">We're excited to have you join our community focused on emotional wellness and personal growth.</p>
            
            <div style="background: linear-gradient(to right, #EA580C, #F97316); border-radius: 12px; padding: 24px; color: white; margin-bottom: 32px;">
              <h3 style="margin: 0 0 16px 0; font-size: 18px;">What's in store for you:</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px; display: flex; align-items: center;">
                  <span style="margin-right: 12px;">✨</span>
                  Weekly wellness tips & mindfulness practices
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: center;">
                  <span style="margin-right: 12px;">🧘</span>
                  Exclusive guided meditation sessions
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: center;">
                  <span style="margin-right: 12px;">🎯</span>
                  Platform updates & new features
                </li>
                <li style="display: flex; align-items: center;">
                  <span style="margin-right: 12px;">🎁</span>
                  Special community events & offers
                </li>
              </ul>
            </div>
            
            <div style="background-color: #FFF7ED; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
              <p style="color: #EA580C; margin: 0; display: flex; align-items: center;">
                <span style="margin-right: 12px;">💡</span>
                <span>Pro Tip: Add <strong>feel@feelmitra.in</strong> to your contacts to never miss an update!</span>
              </p>
            </div>
            
            <p style="color: #334155; line-height: 1.6; text-align: center; margin-bottom: 32px;">Your journey to better emotional well-being starts now. We're here to support you at every step.</p>
            
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #E2E8F0;">
              <p style="color: #64748B; margin: 0 0 8px 0;">With care,</p>
              <p style="color: #EA580C; font-weight: 600; margin: 0;">The Feel Mitra Team</p>
            </div>
          </div>
        </div>
      `
    });

    // Send notification to admin
    await transporter.sendMail({
      from: `Feel Mitra <${senderEmail}>`,
      to: adminEmail,
      subject: 'New Newsletter Subscription',
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAFAFA; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px 32px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="https://feelmitra.in/logo.png" alt="Feel Mitra Logo" style="width: 100px; height: auto;">
            </div>
            
            <div style="background: linear-gradient(to right, #EA580C, #F97316); border-radius: 12px; padding: 24px; color: white; margin-bottom: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; text-align: center;">New Newsletter Subscriber! 🎉</h2>
              <div style="background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 16px;">
                <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
            
            <div style="background-color: #FFF7ED; border-radius: 12px; padding: 20px; text-align: center;">
              <p style="color: #EA580C; margin: 0;">
                <span style="display: block; font-size: 24px; margin-bottom: 8px;">✅</span>
                Subscriber successfully added to the newsletter database
              </p>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  }
} 