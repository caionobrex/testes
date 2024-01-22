export interface ISmtpService {
  sendEmail(email: string, subject: string, message: string): Promise<void>;
}

export class SmtpService implements ISmtpService {
  async sendEmail(email: string, subject: string, message: string): Promise<void> {
    console.log('Production')
    console.log(`Email sent to ${email} with subject ${subject} and message ${message}`);
  }
}

export class MockedSmtpService implements ISmtpService {
  async sendEmail(email: string, subject: string, message: string): Promise<void> {
    console.log(`Email sent to ${email} with subject ${subject} and message ${message}`);
  }
}
