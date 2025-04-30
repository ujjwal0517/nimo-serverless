import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { EmailService } from "./services/EmailService";
import { DynamoDbService } from "./services/DynamoDbService";
import { CryptoService } from "./services/CryptoService";
import { CryptoController } from "./controllers/CryptoController";
// can create separate controller for this lambda
const emailService = new EmailService();
const dynamoService = new DynamoDbService();
const cryptoService = new CryptoService(emailService, dynamoService);
const controller = new CryptoController(cryptoService);
export const handler = async (event: APIGatewayProxyEvent) => {
    console.log(event)
    return controller.getSearchHistory();
  };