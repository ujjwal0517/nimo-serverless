import { Default_PAGINATION_LIMIT, DYNAMO_TABLE, PAGINATION_LIMIT_THRESHOLD } from '../constant/Crypto';
import { CryptoSearchRequest } from '../requests/CryptoSearchRequest';
import { DynamoClient } from '../utils/DynamoClient';
import { PutCommand, PutCommandInput, PutCommandOutput, ScanCommand, ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';

const tableName = process.env.DYNAMO_TABLE || DYNAMO_TABLE;

export class DynamoDbService {
  /**
   * saves a record into dynamo table
   * @param entry
   */
  async save(entry: Record<string, any>): Promise<PutCommandOutput> {
    const putCommandInput: PutCommandInput = {
      TableName: tableName,
      Item: entry
    }
    const putCommand = new PutCommand(putCommandInput);
    return DynamoClient.getClient().send(putCommand);
  }

  /**
   * get records from dynamodb
   * supports pagination through limit and lastkey
   * @param pagination
   */
  async getAll(pagination?: CryptoSearchRequest): Promise<ScanCommandOutput> {
    const limit = (!pagination?.limit || pagination.limit > PAGINATION_LIMIT_THRESHOLD) ? Default_PAGINATION_LIMIT : pagination.limit;
    const lastKey = pagination?.lastKey;
    const params: ScanCommandInput = {
      TableName: tableName,
      Limit: Number(limit)
    }
    if (lastKey) {
      params.ExclusiveStartKey = lastKey ? JSON.parse(decodeURIComponent(lastKey)) : undefined;
    }
    const scanCommand = new ScanCommand(params);

    const result = await DynamoClient.getClient().send(scanCommand);
    return result;
  }
}