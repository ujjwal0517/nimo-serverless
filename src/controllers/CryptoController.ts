import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { plainToInstance } from 'class-transformer';
import { CryptoRequest } from "../requests/CryptoRequest";
import { validate } from "class-validator";
import { CryptoService } from "../services/CryptoService";


export class CryptoController {
    constructor(private cryptoService: CryptoService) {}
    public async getCryptoPrice(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
 {
    try {
        const body = JSON.parse(event.body || '{}');
        const dto = plainToInstance(CryptoRequest, body);
        const errors = await validate(dto);

        if(errors.length > 0) {
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
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: (error as Error).message || `Internal Server Error`})
        }
    }
  
 }
 public async getSearchHistory(): Promise<APIGatewayProxyResult> {
    try {
        const result = await this.cryptoService.getSearchHistory();
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: (error as Error).message || 'Internal Server Error'})
        }
    }   
 }

}
