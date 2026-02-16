// providers.seed.ts - Development seed data for providers
// This file exports plain data objects for seeding the Provider collection
// No database imports or operations here

export const providersSeed = [
    {
        businessName: "PawCare Vet Clinic",
        address: "123 Main St, City, State 12345",
        phone: "+1234567895",
        userId: "", // Will be set after user creation
        email: "vet@pawcare.dev",
        password: "password123",
        rating: 4.5,
        role: "provider" as const,
        providerType: "vet" as const,
        status: "approved" as const
    },
    {
        businessName: "Pet Supplies Shop",
        address: "456 Oak Ave, City, State 12346",
        phone: "+1234567896",
        userId: "", // Will be set after user creation
        email: "shop@pawcare.dev",
        password: "password123",
        rating: 4.2,
        role: "provider" as const,
        providerType: "shop" as const,
        status: "approved" as const
    },
    {
        businessName: "Happy Paws Babysitting",
        address: "789 Pine Rd, City, State 12347",
        phone: "+1234567897",
        userId: "", // Will be set after user creation
        email: "babysitter@pawcare.dev",
        password: "password123",
        rating: 4.8,
        role: "provider" as const,
        providerType: "babysitter" as const,
        status: "approved" as const
    },
    {
        businessName: "New Vet Clinic",
        address: "321 Elm St, City, State 12348",
        phone: "+1234567898",
        userId: "", // Will be set after user creation
        email: "newvet@pawcare.dev",
        password: "password123",
        rating: 0,
        role: "provider" as const,
        providerType: "vet" as const,
        status: "pending" as const
    }
];