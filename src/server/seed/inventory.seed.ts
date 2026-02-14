// inventory.seed.ts - Development seed data for inventory/products
// This file exports plain data objects for seeding the Inventory collection
// No database imports or operations here

export const inventorySeed = [
    {
        product_name: "Premium Dog Food",
        description: "High-quality dog food with real meat and vegetables",
        quantity: 50,
        price: 29.99,
        category: "Food",
        providerId: "" // Will be set to shop provider ID
    },
    {
        product_name: "Cat Litter Box",
        description: "Self-cleaning cat litter box with odor control",
        quantity: 25,
        price: 45.99,
        category: "Supplies",
        providerId: "" // Will be set to shop provider ID
    },
    {
        product_name: "Dog Leash",
        description: "Durable nylon dog leash, 6ft length",
        quantity: 100,
        price: 12.99,
        category: "Accessories",
        providerId: "" // Will be set to shop provider ID
    },
    {
        product_name: "Bird Cage",
        description: "Large bird cage with multiple perches",
        quantity: 15,
        price: 89.99,
        category: "Cages",
        providerId: "" // Will be set to shop provider ID
    },
    {
        product_name: "Fish Tank Filter",
        description: "High-performance filter for 20-50 gallon tanks",
        quantity: 30,
        price: 34.99,
        category: "Aquarium",
        providerId: "" // Will be set to shop provider ID
    },
    {
        product_name: "Pet Shampoo",
        description: "Gentle shampoo for all coat types",
        quantity: 75,
        price: 8.99,
        category: "Grooming",
        providerId: "" // Will be set to shop provider ID
    }
];