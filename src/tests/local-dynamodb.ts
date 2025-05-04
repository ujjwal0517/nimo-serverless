import { CreateTableCommand, DeleteTableCommand, DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const dynamoDbClient = new DynamoDBClient({
    region: 'ap-southeast-2',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: 'fakeAccessKey',
        secretAccessKey: 'fakeSecretAccessKey'
    }
});
export const localClient = DynamoDBDocumentClient.from(dynamoDbClient);
const TABLE_NAME = 'cryptoSearchHistory'
export const createTableIfNotExists = async () => {
  const tables = await dynamoDbClient.send(new ListTablesCommand({}));
  if (!tables.TableNames?.includes(TABLE_NAME)) {
    await dynamoDbClient.send(new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      BillingMode: 'PAY_PER_REQUEST'
    }));
  }
};
