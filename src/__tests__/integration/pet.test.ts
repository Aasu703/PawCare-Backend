import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/user/user.model';
import { PetModel } from '../../models/pet/pet.model';

describe('Pet Integration Tests', () => {
    const testUser = {
        Firstname: 'Pet',
        Lastname: 'Tester',
        email: 'testpetuser@example.com',
        phone: '9123456780',
        password: 'Test@1234',
        confirmPassword: 'Test@1234'
    };

    let token: string;
    let userId: string;
    let petId: string;

    beforeAll(async () => {
        await UserModel.deleteOne({ email: testUser.email });
    });

    afterAll(async () => {
        await PetModel.deleteOne({ _id: petId });
        await UserModel.deleteOne({ email: testUser.email });
    });

    test('register and login user', async () => {
        const reg = await request(app).post('/api/auth/register').send(testUser);
        expect(reg.status).toBe(201);

        const login = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
        expect(login.status).toBe(200);
        expect(login.body).toHaveProperty('token');
        token = login.body.token;
        userId = login.body.data?.user?._id || login.body.data?.user?.id || login.body.data?.user?._id;
    });

    test('POST /api/user/pet should create a pet', async () => {
        const petData = { name: 'Test Pet', species: 'dog', breed: 'mix', age: 3 };
        const res = await request(app)
            .post('/api/user/pet')
            .set('Authorization', `Bearer ${token}`)
            .send(petData);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Pet created');
        petId = res.body.data?._id || res.body.data?.id;
    });

    test('PUT /api/user/pet/:id should update pet and DELETE should remove it', async () => {
        const update = await request(app)
            .put(`/api/user/pet/${petId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated Pet' });
        expect(update.status).toBe(200);
        expect(update.body).toHaveProperty('data');
        expect(update.body.data).toHaveProperty('name', 'Updated Pet');

        const del = await request(app)
            .delete(`/api/user/pet/${petId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(del.status).toBe(200);
        expect(del.body).toHaveProperty('message');
    });

    test('GET /api/user/pet should list user pets', async () => {
        const res = await request(app).get('/api/user/pet').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});
