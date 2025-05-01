import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { plainToInstance } from 'class-transformer';
import { CryptoRequest } from '../requests/CryptoRequest';
import { validate } from 'class-validator';
import { CryptoService } from '../services/CryptoService';
import { CryptoSearchRequest } from '../requests/CryptoSearchRequest';


export class CryptoController {
    constructor(private cryptoService: CryptoService) { }
    /**
     * Handles the POST /crypto endpoint
     * validate request using class validator
     * @param event
     * @returns apigateway proxy result
     */
    public async getCryptoPrice(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            const body = JSON.parse(event.body || '{}');
            const dto = plainToInstance(CryptoRequest, body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Validation failed', errors }),
                };
            }
            const response = await this.cryptoService.fetchAndSendCryptoPrice(dto.crypto, dto.email);
            return {
                statusCode: 200,
                body: JSON.stringify(response)
            };

        } catch (error) {
            console.error('error while fetching price', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: (error as Error).message || `Internal Server Error` })
            }
        }

    }

    /**
     * Handles GET /crypto/history endpoint
     * accepts parimation params: limit and lastKey
     * validate queryParams using class-validator
     * @param event
     * @returns paginated search history
     */
    public async getSearchHistory(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            const queryParams = event.queryStringParameters as CryptoSearchRequest;
            const dto = plainToInstance(CryptoSearchRequest, queryParams);
            const errors = await validate(dto);

            if (errors.length > 0) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Validation failed', errors }),
                };
            }
            const result = await this.cryptoService.getSearchHistory(queryParams);
            return {
                statusCode: 200,
                body: JSON.stringify(result)
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: (error as Error).message || 'Internal Server Error' })
            }
        }
    }

}
