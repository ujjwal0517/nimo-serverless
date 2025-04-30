import {SendEmailCommand, SendEmailCommandInput, SESClient} from '@aws-sdk/client-ses';
export class SesClient {
private static instance: SESClient = new SESClient({})
static getClient(): SESClient {
    return SesClient.instance;
}
}
