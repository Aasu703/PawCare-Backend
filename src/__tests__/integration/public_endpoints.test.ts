import request from 'supertest';
import app from '../../app';

// A bunch of lightweight public endpoint checks to increase test coverage.
const endpoints = [
    { method: 'get', path: '/' },
    { method: 'get', path: '/api' },
    { method: 'get', path: '/api/service' },
    { method: 'get', path: '/api/service/invalid-id' },
    { method: 'get', path: '/api/post' },
    { method: 'get', path: '/api/post/invalid-id' },
    { method: 'get', path: '/api/product' },
    { method: 'get', path: '/api/provider' },
    { method: 'get', path: '/api/provider/invalid-id' },
    { method: 'get', path: '/api/user/pet' },
    { method: 'get', path: '/api/booking' },
    { method: 'get', path: '/api/order' },
    { method: 'get', path: '/api/review' },
    { method: 'get', path: '/api/message' },
    { method: 'get', path: '/api/health-record' },
    { method: 'get', path: '/api/attachment' },
    { method: 'get', path: '/api/feedback' },
    { method: 'get', path: '/api/provider/service' },
    { method: 'get', path: '/api/provider/inventory' },
    { method: 'get', path: '/api/admin/stats' },
    { method: 'post', path: '/api/auth/request-password-reset', body: { email: 'noone@example.com' } },
    { method: 'post', path: '/api/auth/reset-password/invalid-token', body: { newPassword: 'Test@1234' } },
    { method: 'post', path: '/api/upload' },
    { method: 'get', path: '/api/v1' }
];

describe('Public endpoints smoke tests', () => {
    endpoints.forEach((ep, idx) => {
        test(`public endpoint #${idx + 1} ${ep.method.toUpperCase()} ${ep.path}`, async () => {
            let res;
            if (ep.method === 'get') {
                res = await request(app).get(ep.path);
            } else {
                res = await request(app).post(ep.path).send(ep.body || {});
            }
            // All responses should be wrapped by responseStandardizer and include `success` boolean
            expect(res.body).toHaveProperty('success');
            expect(typeof res.body.success).toBe('boolean');
        });
    });
});
