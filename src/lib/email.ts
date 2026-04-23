import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendNewLeadNotification(
  agentEmail: string,
  agentName: string,
  leadName: string,
  leadEmail: string,
  propertyInterest: string
) {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
          <h2 style="margin: 0;">New Lead Assignment</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Hi ${agentName},</p>
          <p>A new lead has been assigned to you:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Lead Name:</strong> ${leadName}</p>
            <p><strong>Email:</strong> ${leadEmail}</p>
            <p><strong>Property Interest:</strong> ${propertyInterest}</p>
          </div>
          <p>Please review the lead details in your dashboard and follow up accordingly.</p>
          <p>Best regards,<br>BloomCRM Team</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: agentEmail,
      subject: `New Lead Assignment - ${leadName}`,
      html: htmlTemplate,
    });

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export async function sendLeadCreatedNotification(
  adminEmails: string[],
  leadName: string,
  leadEmail: string,
  budget: number
) {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
          <h2 style="margin: 0;">New Lead Alert</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>A new lead has been created in the system:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Lead Name:</strong> ${leadName}</p>
            <p><strong>Email:</strong> ${leadEmail}</p>
            <p><strong>Budget:</strong> PKR ${budget.toLocaleString()}</p>
          </div>
          <p>Log in to your dashboard to assign this lead to an agent.</p>
          <p>Best regards,<br>BloomCRM Team</p>
        </div>
      </div>
    `;

    for (const email of adminEmails) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `New Lead Alert - ${leadName}`,
        html: htmlTemplate,
      });
    }

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}
