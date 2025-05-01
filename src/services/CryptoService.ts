import { CryptoEntry } from '../interface/CryptoEntry';
import { generateEmailContent } from '../templates/cryptoEmailTemplate';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDbService } from './DynamoDbService';
import { SESService } from './SESService';
import { CryptoSearchRequest } from '../requests/CryptoSearchRequest';

export class CryptoService {
    constructor(private emailService: SESService, private dynamoDbService: DynamoDbService) { }

    /**
     * Fetches current price of given crypto using third party api CoinGecko API,
     * sends price details to provided email
     * saves record to dynamo
     * @param cryptoName
     * @param email 
     * @returns {message: string, cryptoName: string, price: number}
     */
    async fetchAndSendCryptoPrice(cryptoName: string, email: string): Promise<{ message: string, cryptoName: string, price: number }> {
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?names=${cryptoName}&vs_currencies=usd`;
        const responseFromFetch = await fetch(apiUrl);
        const cryptoInfo = await responseFromFetch.json();
        const cryptoPrice = cryptoInfo[cryptoName]?.usd;

        if (!cryptoPrice) {
            throw new Error('Invalid Crypto currency name provided.')
        }
        const emailContent = generateEmailContent(cryptoName, cryptoPrice);
        await this.emailService.sendEmail(email, emailContent.subject, emailContent.body);
        const prepareHistoryToSave: CryptoEntry = {
            id: uuidv4(),
            cryptoName,
            email,
            cryptoPrice,
            timestamp: new Date().toISOString()
        }
        await this.dynamoDbService.save(prepareHistoryToSave);
        return { message: `Price of the crypto currency sent successfully to ${email}`, cryptoName, price: cryptoPrice };

    }

    /**
     * retrieve search history from dynamodb on pagination
     * @param pagination  - object containing limit and lasKey parameter
     * @returns Paginated search history and next page start key
     */
    async getSearchHistory(pagination: CryptoSearchRequest) {
        const result = await this.dynamoDbService.getAll(pagination);
        return {
            items: result.Items,
            nextPageToken: result.LastEvaluatedKey
              ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
              : null
          } 
    }
}