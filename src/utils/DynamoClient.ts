import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DynamoClient{
    private static instance: DynamoDBDocumentClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({})
    );
    
    static getClient(): DynamoDBDocumentClient {
      return this.instance;
    }
  }

