import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/user/user.model';
import { PetModel } from '../../models/pet/pet.model';
import { HealthRecordModel } from '../../models/pet/healthrecord.model';

describe('HealthRecord Integration Tests', () => {
    const testUser = {
        Firstname: 'Health',
        Lastname: 'Tester',
        email: 'testhealthuser@example.com',
        phone: '9123456790',
        password: 'Test@1234',
        confirmPassword: 'Test@1234'
    };

    let token: string;
    let petId: string;
    let recordId: string;

    beforeAll(async () => {
        await UserModel.deleteOne({ email: testUser.email });
        await request(app).post('/api/auth/register').send(testUser);
        const login = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
        token = login.body.token;

        const petRes = await request(app)
            .post('/api/user/pet')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'HR Pet', species: 'cat' });
        petId = petRes.body.data?._id || petRes.body.data?.id;
    });

    afterAll(async () => {
        await HealthRecordModel.deleteOne({ _id: recordId });
        await PetModel.deleteOne({ _id: petId });
        await UserModel.deleteOne({ email: testUser.email });
    });

    test('POST /api/health-record should create a health record', async () => {
        const payload = {
            petId,
            recordType: 'vaccination',
            title: 'Rabies vaccine',
            description: 'Administered rabies vaccine',
            date: '2026-02-14',
            nextDueDate: '2027-02-14'
        };
        const res = await request(app)
            .post('/api/health-record')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
        recordId = res.body.data?._id || res.body.data?.id;
        expect(recordId).toBeDefined();
    });

    test('GET /api/health-record/pet/:petId should list records', async () => {
        const res = await request(app).get(`/api/health-record/pet/${petId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    test('GET /api/health-record/:id should return record', async () => {
        if (!recordId) return fail('recordId was not created');
        const res = await request(app).get(`/api/health-record/${recordId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    });

    test('PUT /api/health-record/:id should update record', async () => {
        if (!recordId) return fail('recordId was not created');
        const res = await request(app).put(`/api/health-record/${recordId}`).set('Authorization', `Bearer ${token}`).send({ description: 'Updated note' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    });

    test('DELETE /api/health-record/:id should remove record', async () => {
        if (!recordId) return fail('recordId was not created');
        const res = await request(app).delete(`/api/health-record/${recordId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message');
    });
});
