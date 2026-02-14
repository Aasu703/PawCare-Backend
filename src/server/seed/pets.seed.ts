// pets.seed.ts - Development seed data for pets
// This file exports plain data objects for seeding the Pet collection
// No database imports or operations here

export const petsSeed = [
    {
        name: "Max",
        species: "Dog",
        breed: "Golden Retriever",
        age: 3,
        weight: 65,
        imageUrl: "",
        allergies: "None",
        dietNotes: "Regular dry food, twice daily",
        ownerId: "" // Will be set to user ID
    },
    {
        name: "Bella",
        species: "Cat",
        breed: "Siamese",
        age: 2,
        weight: 12,
        imageUrl: "",
        allergies: "Chicken",
        dietNotes: "Wet food in the morning, dry food at night",
        ownerId: "" // Will be set to user ID
    },
    {
        name: "Charlie",
        species: "Dog",
        breed: "Beagle",
        age: 5,
        weight: 25,
        imageUrl: "",
        allergies: "None",
        dietNotes: "Small breed formula, three times daily",
        ownerId: "" // Will be set to user ID
    },
    {
        name: "Luna",
        species: "Bird",
        breed: "Cockatiel",
        age: 1,
        weight: 0.1,
        imageUrl: "",
        allergies: "None",
        dietNotes: "Seed mix and fresh vegetables daily",
        ownerId: "" // Will be set to user ID
    },
    {
        name: "Goldie",
        species: "Fish",
        breed: "Goldfish",
        age: 2,
        weight: 0.05,
        imageUrl: "",
        allergies: "None",
        dietNotes: "Flake food twice daily",
        ownerId: "" // Will be set to user ID
    }
];