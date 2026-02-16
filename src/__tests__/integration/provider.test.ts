import request from 'supertest';
import app from '../../app';
import { ProviderModel } from '../../models/provider/provider.model';

describe('Provider Integration Tests', () => {
    const testProvider = {
        businessName: 'Test Provider',
        address: '123 Test St',
        phone: '9999999999',
        providerType: 'shop',
        email: 'testprovider@example.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234'
    };

    let providerId: string | undefined;
    let token: string | undefined;

    beforeAll(async () => {
        await ProviderModel.deleteOne({ email: testProvider.email });
    });

    afterAll(async () => {
        await ProviderModel.deleteOne({ email: testProvider.email });
    });

    test('POST /api/provider/register should create provider', async () => {
        const res = await request(app).post('/api/provider/register').send(testProvider);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Provider Created');
        providerId = res.body.data?._id || res.body.data?.id;
    });

    test('POST /api/provider/login should login provider', async () => {
        const res = await request(app).post('/api/provider/login').send({ email: testProvider.email, password: testProvider.password });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    test('GET /api/provider should list providers and GET /api/provider/:id should return provider', async () => {
        const list = await request(app).get('/api/provider');
        expect(list.status).toBe(200);
        expect(list.body).toHaveProperty('data');
        const get = await request(app).get(`/api/provider/${providerId}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('data');
        expect(get.body.data).toHaveProperty('_id');
    });
});
