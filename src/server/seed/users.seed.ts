// users.seed.ts - Development seed data for users
// This file exports plain data objects for seeding the User collection
// No database imports or operations here
// Note: Passwords are in plain text and will be hashed during seeding

export const usersSeed = [
    {
        email: "admin@pawcare.dev",
        password: "admin123",
        Firstname: "Admin",
        Lastname: "User",
        phone: "+1234567890",
        role: "admin" as const,
        imageUrl: ""
    },
    {
        email: "john.doe@pawcare.dev",
        password: "password123",
        Firstname: "John",
        Lastname: "Doe",
        phone: "+1234567891",
        role: "user" as const,
        imageUrl: ""
    },
    {
        email: "jane.smith@pawcare.dev",
        password: "password123",
        Firstname: "Jane",
        Lastname: "Smith",
        phone: "+1234567892",
        role: "user" as const,
        imageUrl: ""
    },
    {
        email: "mike.wilson@pawcare.dev",
        password: "password123",
        Firstname: "Mike",
        Lastname: "Wilson",
        phone: "+1234567893",
        role: "user" as const,
        imageUrl: ""
    },
    {
        email: "sarah.johnson@pawcare.dev",
        password: "password123",
        Firstname: "Sarah",
        Lastname: "Johnson",
        phone: "+1234567894",
        role: "user" as const,
        imageUrl: ""
    }
];