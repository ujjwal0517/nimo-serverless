import { DynamoClient } from '../utils/DynamoClient';
import { PutCommand, PutCommandInput, ScanCommand } from '@aws-sdk/lib-dynamodb';

const tableName = process.env.DYNAMO_TABLE!;

export class DynamoDbService {
  async save(entry: Record<string, any>) {
    const putCommandInput: PutCommandInput = {
        TableName: tableName,
        Item: entry
    }
    const putCommand = new PutCommand(putCommandInput);
    await DynamoClient.getClient().send(putCommand);
  }

  async getAll() {
    const scanCommand = new ScanCommand({ TableName: tableName });
    const result = await DynamoClient.getClient().send(scanCommand);
    return result.Items || [];
  }
}