import {SendEmailCommand, SendEmailCommandInput, SESClient} from '@aws-sdk/client-ses';
const sesClient = new SESClient({})

export const sendEmail = (sendMessageCommandInput: SendEmailCommandInput) => {
    const sendEmailCommand = new SendEmailCommand(sendMessageCommandInput)
    return sesClient.send(sendEmailCommand);
}