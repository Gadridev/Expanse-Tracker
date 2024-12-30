import nodemailer, { Transporter } from 'nodemailer';

interface User {
  email: string;
  name: string;
}

export default class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user: User, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0]; // Extract first name
    this.url = url;
    this.from = `Your Company <${process.env.EMAIL_FROM}>`; // Sender's email
  }

  // Method to configure the email transport using Mailtrap for development
  private newTransport(): Transporter {
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io', // Mailtrap SMTP host
      port: 25, // Mailtrap SMTP port
      auth: {
        user: process.env.MAILTRAP_USER, // Your Mailtrap SMTP username
        pass: process.env.EMAIL_PASSWORD, // Your Mailtrap SMTP password
      },
    });
  }

  // Send the email
  private async send(subject: string, htmlContent: string): Promise<void> {
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]+>/g, ''), // Strip HTML for plain text version
    };

    // Send email using the configured transport
    await this.newTransport().sendMail(mailOptions);
  }

  // Method to send a welcome email
  async sendWelcome(): Promise<void> {
    const htmlContent = `
      <h1>Welcome, ${this.firstName}!</h1>
      <p>We are thrilled to have you with us. Enjoy your journey!</p>
      <p>Visit your account <a href="${this.url}">here</a>.</p>
    `;
    await this.send('Welcome to Our Company!', htmlContent);
  }

  // Method to send password reset email
  async sendPasswordReset(): Promise<void> {
    const htmlContent = `
      <h1>Password Reset</h1>
      <p>Hello ${this.firstName},</p>
      <p>We received a request to reset your password.</p>
      <p>Click <a href="${this.url}">here</a> to reset your password.</p>
      <p>This link will expire in 10 minutes.</p>
    `;
    await this.send('Password Reset Request', htmlContent);
  }
}
