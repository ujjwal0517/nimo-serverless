import { APIGatewayProxyHandler } from "aws-lambda";
import { SESService } from "./services/SESService";
import { DynamoDbService } from "./services/DynamoDbService";
import { CryptoService } from "./services/CryptoService";
import { CryptoController } from "./controllers/CryptoController";

const emailService = new SESService();
const dynamoService = new DynamoDbService();
const cryptoService = new CryptoService(emailService, dynamoService);
const controller = new CryptoController(cryptoService);
export const handler: APIGatewayProxyHandler = async (event) => {
    return controller.getCryptoPrice(event);
}