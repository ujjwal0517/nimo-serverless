import { SesClient } from '../utils/SesClient';
import { SendEmailCommand } from '@aws-sdk/client-ses';

const emailFrom = process.env.EMAIL_FROM!;

export class EmailService {
  async sendEmail(to: string, subject: string, body: string) {
    const command = new SendEmailCommand({
      Source: emailFrom,
      Destination: { ToAddresses: [process.env.EMAIL_FROM!] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } },
      },
    });
    await SesClient.getClient().send(command);
  }
}
