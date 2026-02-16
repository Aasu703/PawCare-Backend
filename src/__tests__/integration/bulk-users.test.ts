import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/user/user.model';

describe('Bulk Users Register/Login Tests', () => {
    const users = Array.from({ length: 10 }).map((_, i) => ({
        Firstname: `Bulk${i}`,
        Lastname: 'Tester',
        email: `bulkuser${i}@example.com`,
        phone: `90000000${100 + i}`,
        password: 'Test@1234',
        confirmPassword: 'Test@1234'
    }));

    beforeAll(async () => {
        // Clean up any leftover test users
        await Promise.all(users.map(u => UserModel.deleteOne({ email: u.email })));
    });

    afterAll(async () => {
        await Promise.all(users.map(u => UserModel.deleteOne({ email: u.email })));
    });

    test.each(users)('Register user %o', async (user) => {
        const res = await request(app).post('/api/auth/register').send(user);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'User Created');
    });

    test.each(users)('Login user %o', async (user) => {
        const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});
