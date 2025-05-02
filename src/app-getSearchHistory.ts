import { APIGatewayProxyEvent } from "aws-lambda";
import { SESService } from "./services/SESService";
import { DynamoDbService } from "./services/DynamoDbService";
import { CryptoService } from "./services/CryptoService";
import { CryptoController } from "./controllers/CryptoController";
import { Logger } from "./utils/Logger";
// can create separate controller for this lambda
const sesService = new SESService();
const dynamoService = new DynamoDbService();
const cryptoService = new CryptoService(sesService, dynamoService);
const controller = new CryptoController(cryptoService);
export const handler = async (event: APIGatewayProxyEvent) => {
    Logger.info('event listened')
    return controller.getSearchHistory(event);
  };