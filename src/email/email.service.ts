import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private from: string;
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.from =
      this.configService.get<string>('RESEND_FROM_EMAIL') ||
      'fufawakgari174@gmail.com';
    this.resend = new Resend(apiKey);
  }
  async sendVerificationEmail(to: string, token: string) {
    const verifyUrl = `http://localhost:3000/auth/verify?token=${token}`;

    try {
      const response = await this.resend.emails.send({
        from: this.from,
        to,
        subject: 'Verify Your Email',
        html: `
          <h2>Welcome!</h2>
          <p>Click the button below to verify your email:</p>
          <a href="${verifyUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p>${verifyUrl}</p>
        `,
      });

      console.log('Verification email sent:', response);
    } catch (error) {
      console.log('Error Sending Email verification: ', error);
    }
  }
}
