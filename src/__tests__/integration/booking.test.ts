import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/user/user.model';
import { BookingModel } from '../../models/user/booking.model';

describe('Booking Integration Tests', () => {
    const testUser = {
        Firstname: 'Book',
        Lastname: 'Tester',
        email: 'testbookinguser@example.com',
        phone: '9123456781',
        password: 'Test@1234',
        confirmPassword: 'Test@1234'
    };

    let token: string;
    let bookingId: string;

    beforeAll(async () => {
        await UserModel.deleteOne({ email: testUser.email });
    });

    afterAll(async () => {
        await BookingModel.deleteOne({ _id: bookingId });
        await UserModel.deleteOne({ email: testUser.email });
    });

    test('register and login user for booking', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const login = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
        expect(login.status).toBe(200);
        token = login.body.token;
    });

    test('POST /api/booking should create booking', async () => {
        const bookingData = { startTime: '2026-02-14T10:00:00Z', endTime: '2026-02-14T11:00:00Z' };
        const res = await request(app).post('/api/booking').set('Authorization', `Bearer ${token}`).send(bookingData);
        expect(res.status).toBe(201);
        // API wraps created booking in { success, message, data }
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('_id');
        bookingId = res.body.data._id || res.body.data.id;
    });

    test('GET /api/booking/:id should return booking', async () => {
        const res = await request(app).get(`/api/booking/${bookingId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        // App response is standardized: booking is under res.body.data
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('_id');
    });

    test('PUT /api/booking/:id should update and DELETE should remove booking', async () => {
        const upd = await request(app)
            .put(`/api/booking/${bookingId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ notes: 'updated via test' });
        expect(upd.status).toBe(200);
        expect(upd.body).toHaveProperty('data');

        const del = await request(app)
            .delete(`/api/booking/${bookingId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(del.status).toBe(200);
        expect(del.body).toHaveProperty('message');
    });
});
