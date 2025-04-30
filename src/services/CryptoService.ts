import { CryptoEntry } from "../controllers/interface/CryptoEntry";
import { generateEmailContent } from "../templates/cryptoEmailTemplate";
import { v4 as uuidv4 } from 'uuid';
import { DynamoDbService } from "./DynamoDbService";
import { EmailService } from "./EmailService";

export class CryptoService {
    constructor(private emailService: EmailService, private dynamoDbService: DynamoDbService) { }
    async fetchAndSendCryptoPrice(crypto: string, email:string) {
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`;
        const responseFromFetch = await fetch(apiUrl);
        const cryptoInfo = await responseFromFetch.json();
        const cryptoPrice = cryptoInfo[crypto]?.usd;

        if(!cryptoPrice) {
            throw new Error('Invalid Crypto currency name provided.')
        }
        const emailContent = generateEmailContent(crypto, cryptoPrice);
        await this.emailService.sendEmail(email, emailContent.subject, emailContent.body);
        const prepareHistoryToSave: CryptoEntry = {
            id: uuidv4(),
            crypto,
            email,
            cryptoPrice,
            timestamp: new Date().toISOString()
        }
        await this.dynamoDbService.save(prepareHistoryToSave);
        return { message: `Price of the crypto currency sent successfully to ${email}`, crypto, cryptoPrice };

    }

    async getSearchHistory() {
        return this.dynamoDbService.getAll();
    }
}