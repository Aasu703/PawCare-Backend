import request from 'supertest';
import app from "../../app";
import { UserModel } from '../../models/user.model';

describe(
    "Auhentication Integration Tests", //name of test suite group
    () => { //what to do in test
        const testUser = {
            Firstname:"Test",
            Lastname: "user12",
            email: "testuser12@example.com",
            phone: "9821456764",
            password: "Test@1234",
            confirmPassword: "Test@1234",
           
        }
        beforeAll(async () => {
            // Clean up test user if exists
            await UserModel.deleteOne({ email: testUser.email });
        });
        afterAll(async () => {
            // Clean up test user after tests
            await UserModel.deleteOne({ email: testUser.email });
        });

        describe(
            "POST /api/auth/register", // nested test suite/group
            () => {
                test(
                    "should register a new user", // name of individual test
                    async () => { // what to do in test
                        const response = await request(app)
                            .post("/api/auth/register")
                            .send(testUser)
                        
                        expect(response.status).toBe(201);
                        expect(response.body).toHaveProperty(
                            "message", 
                            "User Created"
                        );
                    }
                )
            }
        )
        const testUser2 = {
            email: "testuser12@example.com",
            password: "Test@1234",
        }
        describe(
            "POST /api/auth/login", // nested test suite/group
            () => {
                test(
                    "should login an existing user", // name of individual test
                    async () => { // what to do in test
                        const response = await request(app)
                            .post("/api/auth/login")
                            .send(testUser2)
                        
                        expect(response.status).toBe(200);
                        expect(response.body).toHaveProperty(
                            "message", 
                            "Login successful"
                        );
                    }
                )
            }
        )
    }
)