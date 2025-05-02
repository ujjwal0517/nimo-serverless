import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { plainToInstance } from 'class-transformer';
import { CryptoRequest } from '../requests/CryptoRequest';
import { validate } from 'class-validator';
import { CryptoService } from '../services/CryptoService';
import { CryptoSearchRequest } from '../requests/CryptoSearchRequest';
import { HttpStatus } from '../enum/HttpStatus';
import { Logger } from '../utils/Logger';


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
                Logger.error('Validation Error', errors)
                return {
                    statusCode: HttpStatus.UNPROCESSED_ENTITY,
                    body: JSON.stringify({ message: 'Validation failed', errors }),
                };
            }
            const response = await this.cryptoService.fetchAndSendCryptoPrice(dto.cryptoName, dto.email);
            return {
                statusCode: HttpStatus.OK,
                body: JSON.stringify(response)
            };

        } catch (error) {
            Logger.error('error while fetching price', error);
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
            const queryParams = event.queryStringParameters as CryptoSearchRequest || {} ;
            const dto = plainToInstance(CryptoSearchRequest, queryParams);
            if(Object.keys(dto).length !=0) {
                const errors = await validate(dto);
                if (errors.length > 0) {
                    return {
                        statusCode: HttpStatus.UNPROCESSED_ENTITY,
                        body: JSON.stringify({ message: 'Validation failed', errors }),
                    };
                }
            }
            const result = await this.cryptoService.getSearchHistory(queryParams);
            return {
                statusCode: HttpStatus.OK,
                body: JSON.stringify(result)
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                body: JSON.stringify({ message: (error as Error).message || 'Internal Server Error' })
            }
        }
    }

}
