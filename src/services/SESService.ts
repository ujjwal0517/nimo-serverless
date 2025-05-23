import { SesClient } from '../utils/SesClient';
import { SendEmailCommand } from '@aws-sdk/client-ses';

const emailFrom = process.env.EMAIL_FROM!;

export class SESService {

  /**
   * send email to provided mail
   * @param to
   * @param subject
   * @param body
   */
  async sendEmail(to: string, subject: string, body: string) {
    const command = new SendEmailCommand({
      Source: emailFrom,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } },
      },
    });
    await SesClient.getClient().send(command);
  }
}
