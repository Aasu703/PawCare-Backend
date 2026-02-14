// reviews.seed.ts - Development seed data for reviews
// This file exports plain data objects for seeding the Review collection
// No database imports or operations here

export const reviewsSeed = [
    {
        rating: 5,
        comment: "Excellent service! Dr. Smith was very professional and caring with my dog.",
        userId: "", // Will be set to user ID
        providerId: "", // Will be set to vet provider ID
        productId: null,
        reviewType: "provider" as const
    },
    {
        rating: 4,
        comment: "Good products, fast shipping. The dog food is great quality.",
        userId: "", // Will be set to user ID
        providerId: "", // Will be set to shop provider ID
        productId: "", // Will be set to product ID
        reviewType: "product" as const
    },
    {
        rating: 5,
        comment: "Amazing pet sitting service! My cat was well taken care of.",
        userId: "", // Will be set to user ID
        providerId: "", // Will be set to babysitter provider ID
        productId: null,
        reviewType: "provider" as const
    },
    {
        rating: 3,
        comment: "Decent experience, but could be better organized.",
        userId: "", // Will be set to user ID
        providerId: "", // Will be set to vet provider ID
        productId: null,
        reviewType: "provider" as const
    },
    {
        rating: 4,
        comment: "Love this leash! Very durable and comfortable.",
        userId: "", // Will be set to user ID
        providerId: "", // Will be set to shop provider ID
        productId: "", // Will be set to product ID
        reviewType: "product" as const
    }
];