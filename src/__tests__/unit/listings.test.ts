import request from 'supertest';
import {API, AgentHeaderEnum, ADMIN_USER_ID} from '@src/__tests__/fixtures/common.data';

describe('Listings Endpoint', () => {
    describe('Success Case :- GET /api/v1/listings', () => {
        it('should return 200 with listings and pageInfo', async () => {
            const response = await request(API)
                .get('/api/v1/listings')
                .query({page: 1, limit: 10});
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.message).toBe('Listings fetched successfully');
            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.pageInfo).toBeDefined();
            expect(response.body.pageInfo.limit).toBeLessThanOrEqual(10);
        });

        it('should return single listing data', async () => {
            const response = await request(API).get(`/api/v1/listings/${ADMIN_USER_ID}`);


            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Listing fetched successfully');
            expect(response.body.data).toBeDefined();
            expect(response.body.data.id).toBe(ADMIN_USER_ID);
        });
    });

    describe('Negative Case :- GET /api/v1/listings/:id', () => {
        it('should return 400 for non-integer id', async () => {
            const response = await request(API).get('/api/v1/listings/abc');

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toMatch(/invalid listing id/i);
        });
    });

    describe('Admin vs Non-Admin :- GET /api/v1/listings', () => {
        it('should hide internalStatusNotes for non-admin', async () => {
            const response = await request(API)
                .get('/api/v1/listings')
                .set('x-agent-id', AgentHeaderEnum.NON_ADMIN)
                .query({page: 1, limit: 10});

            expect(response.statusCode).toBe(200);
            response.body.data.forEach((listing: any) => {
                expect(listing.internalStatusNotes).toBeUndefined();
            });
        });

        it('should expose internalStatusNotes for admin', async () => {
            const response = await request(API)
                .get('/api/v1/listings')
                .set('x-agent-id', AgentHeaderEnum.ADMIN)
                .query({page: 1, limit: 10});

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toBeDefined();
        });
    });
});
