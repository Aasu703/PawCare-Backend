import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { UserModel } from '../../models/user/user.model';
import { InventoryModel } from '../../models/provider/inventory.model';
import { OrderModel } from '../../models/user/order.model';

describe('Order Integration Tests', () => {
    const testUser = {
        Firstname: 'Order',
        Lastname: 'Tester',
        email: 'testorderuser@example.com',
        phone: '9123456782',
        password: 'Test@1234',
        confirmPassword: 'Test@1234'
    };

    let token: string;
    let inventoryId: string;
    let orderId: string;

    beforeAll(async () => {
        await UserModel.deleteOne({ email: testUser.email });
        // create inventory item directly
        const inv = await InventoryModel.create({ product_name: 'Test Product', quantity: 10, price: 100, providerId: new mongoose.Types.ObjectId().toString() });
        inventoryId = inv._id.toString();
    });

    afterAll(async () => {
        await OrderModel.deleteMany({ userId: { $exists: true } }); // Clean up any remaining test orders
        await InventoryModel.deleteOne({ _id: inventoryId });
        await UserModel.deleteOne({ email: testUser.email });
    });

    test('register and login user for orders', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const login = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
        expect(login.status).toBe(200);
        token = login.body.token;
    });

    test('POST /api/order should place an order', async () => {
        const orderData = {
            items: [
                { productId: inventoryId, productName: 'Test Product', quantity: 2, price: 100 }
            ],
            totalAmount: 200
        };
        const res = await request(app).post('/api/order').set('Authorization', `Bearer ${token}`).send(orderData);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Order placed');
        orderId = res.body.data?._id || res.body.data?.id;
    });
    
    test('GET /api/order/:id should return order; DELETE pending order; cannot cancel confirmed', async () => {
        const get = await request(app).get(`/api/order/${orderId}`).set('Authorization', `Bearer ${token}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('data');

        // Can delete while pending
        const del = await request(app).delete(`/api/order/${orderId}`).set('Authorization', `Bearer ${token}`);
        expect(del.status).toBe(200);
        expect(del.body).toHaveProperty('message');

        // Create another order to test confirmed status
        const orderData2 = {
            items: [{ productId: inventoryId, productName: 'Test Product', quantity: 1, price: 100 }],
            totalAmount: 100
        };
        const res2 = await request(app).post('/api/order').set('Authorization', `Bearer ${token}`).send(orderData2);
        const orderId2 = res2.body.data?._id || res2.body.data?.id;

        // Update to confirmed
        const upd = await request(app).put(`/api/order/${orderId2}`).set('Authorization', `Bearer ${token}`).send({ status: 'processing' });
        expect(upd.status).toBe(200);

        // Cannot delete confirmed order
        const del2 = await request(app).delete(`/api/order/${orderId2}`).set('Authorization', `Bearer ${token}`);
        expect(del2.status).toBe(403);
        expect(del2.body.message).toContain('already being processed');

        // Cleanup
        await OrderModel.deleteOne({ _id: orderId2 });
    });
});
