import axios from 'axios';
import { CryptoService } from '../../services/CryptoService';
import { SESService } from '../../services/SESService';
import { DynamoDbService } from '../../services/DynamoDbService';
import { createTableIfNotExists, localClient } from '../local-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
jest.mock('../../utils/DynamoClient', () => ({
  DynamoClient: {
    getClient: () => localClient
  }
}))
jest.mock('axios');
const sesMock = mockClient(SESClient);
describe('CryptoService', () => {

  const emailService = new SESService();
  const dynamoDbService = new DynamoDbService();
  const cryptoService = new CryptoService(emailService, dynamoDbService);

  beforeAll(async () => {
    await createTableIfNotExists();
    sesMock.reset();
  });

  it('should send crypto price email and save to DB', async () => {
    sesMock.on(SendEmailCommand).resolves({});
    (axios.get as jest.Mock).mockResolvedValue({
      data: { bitcoin: { usd: 50000 } }
    });
    const result = await cryptoService.fetchAndSendCryptoPrice('bitcoin', 'test@example.com');
    expect(sesMock.calls()).toHaveLength(1)
    expect(result).toEqual({
      message: expect.stringContaining('sent successfully'),
      cryptoName: 'bitcoin',
      price: 50000
    });
  });

  it('should retrieve search history', async () => {
    const result = await cryptoService.getSearchHistory();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items?.length).toBeGreaterThan(0);
  });
});
