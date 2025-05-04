import { DynamoDbService } from "../../services/DynamoDbService";
import { createTableIfNotExists, localClient } from "../local-dynamodb";


jest.mock('../../utils/DynamoClient', () => ({
    DynamoClient: {
        getClient: () => localClient
    }
}))


describe('DynamoDbService', () => {
    const dynamoDbService = new DynamoDbService();
    beforeAll(() => {
        createTableIfNotExists();
    });
    it('should save and retrieve entries', async () => {
        const timeStamp = new Date().toISOString();
        const entry = {
            id: 'test-1',
            cryptoName: 'Bitcoin',
            email: 'dhekeujju@gmail.com',
            cryptoPrice: 1200,
            timeStamp
        }
        await dynamoDbService.save(entry);
        const res = await dynamoDbService.getAll();
        expect(res.Items).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'test-1' })]))
    })
})

