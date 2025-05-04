import { mockClient } from 'aws-sdk-client-mock';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SESService } from '../../services/SESService';
const sesMock = mockClient(SESClient);

describe('SESService', () => {
  const sesService = new SESService();

  beforeEach(() => {
    sesMock.reset();
  });

  it('should send an email successfully', async () => {
    sesMock.on(SendEmailCommand).resolves({});
    await expect(
      sesService.sendEmail('recipient@example.com', 'Test Subject', 'Test Body')
    ).resolves.not.toThrow();
    expect(sesMock.calls()).toHaveLength(1);
    expect(sesMock.call(0).args[0].input).toMatchObject({
      Source: process.env.EMAIL_FROM,
      Destination: { ToAddresses: ['recipient@example.com'] },
      Message: {
        Subject: { Data: 'Test Subject' },
        Body: { Text: { Data: 'Test Body' } }
      }
    });
  });
});