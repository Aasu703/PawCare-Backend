import { connectdb } from "../database/mongodb";
import mongoose from 'mongoose';

beforeAll(async () => {
    await connectdb();
});

afterAll(async () => {
    // Add any teardown logic if necessary
    await mongoose.connection.close();
});