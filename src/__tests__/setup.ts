import { beforeAll, afterAll } from '@jest/globals';

beforeAll(async () => {
    console.info('Tests starting — ensure the API server is running at http://localhost:7001');
});

afterAll(async () => {
    console.info('Tests complete');
});
