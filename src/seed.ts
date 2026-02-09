import mongoose from "mongoose";
import { UserModel } from "./models/user/user.model";
import { PetModel } from "./models/pet/pet.model";
import { ProviderModel } from "./models/provider/provider.model";
import bcryptjs from "bcryptjs";
import { MONGO_URI } from "./config";

async function seedDatabase() {
    try {
        // Connect to database
        await mongoose.connect(MONGO_URI);
        console.log("Connected to database");

        // Clear existing data
        await UserModel.deleteMany({});
        await PetModel.deleteMany({});
        await ProviderModel.deleteMany({});
        console.log("Cleared existing data");

        // Seed Users
        const hashedPassword = await bcryptjs.hash("password123", 10);

        const firstNames = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana", "Edward", "Fiona", "George", "Helen", "Ian", "Julia", "Kevin", "Laura", "Michael", "Nancy", "Oliver", "Paula", "Quinn", "Rachel", "Steve", "Tina", "Ulysses", "Victoria", "William"];
        const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White"];

        const users = [
            {
                email: "admin@pawcare.com",
                password: hashedPassword,
                Firstname: "Admin",
                Lastname: "User",
                phone: "+1234567890",
                role: "admin"
            }
        ];

        // Generate 24 regular users
        for (let i = 0; i < 24; i++) {
            users.push({
                email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@example.com`,
                password: hashedPassword,
                Firstname: firstNames[i],
                Lastname: lastNames[i],
                phone: `+1234567${String(891 + i).padStart(3, '0')}`,
                role: "user"
            });
        }

        const createdUsers = await UserModel.insertMany(users);
        console.log("Seeded users:", createdUsers.length);

        // Seed Providers
        const businessNames = [
            "City Vet Clinic", "Pawfect Grooming", "Smart Paws Training", "Happy Tails Vet", "Furry Friends Spa",
            "Pet Paradise Grooming", "Wagging Tails Training", "Animal Care Center", "Purrfect Paws Salon", "Bark Avenue Clinic",
            "Whisker Wonders Grooming", "Tail Waggers Academy", "Companion Animal Hospital", "Pet Pamper Palace", "Critter Care Clinic",
            "Fluffy Friends Grooming", "Obedience Masters", "Veterinary Excellence Center", "Grooming Galaxy", "Pet Behavior Pros",
            "Healthy Paws Hospital", "Luxury Pet Spa", "Training Titans", "Animal Wellness Clinic", "Supreme Grooming Studio"
        ];

        const providerCities = ["Springfield", "Riverside", "Meadowbrook", "Oakwood", "Pineville", "Maplewood", "Cedarburg", "Elmwood", "Birchwood", "Willowbrook"];

        const providers = [];

        for (let i = 0; i < 25; i++) {
            const city = providerCities[i % providerCities.length];
            providers.push({
                businessName: businessNames[i],
                address: `${100 + i} Main St, ${city}, State ${12345 + i}`,
                phone: `+1234567${String(895 + i).padStart(3, '0')}`,
                email: `contact@${businessNames[i].toLowerCase().replace(/\s+/g, '')}@example.com`,
                password: hashedPassword,
                rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10 // Random rating between 3.5-5.0
            });
        }

        const createdProviders = await ProviderModel.insertMany(providers);
        console.log("Seeded providers:", createdProviders.length);

        // Seed Pets (2 pets per user, 50 total)
        const dogBreeds = ["Golden Retriever", "German Shepherd", "Beagle", "Bulldog", "Poodle", "Labrador", "Siberian Husky", "Boxer", "Dachshund", "Chihuahua"];
        const catBreeds = ["Siamese", "Persian", "Maine Coon", "British Shorthair", "Ragdoll", "Bengal", "Scottish Fold", "Russian Blue", "Abyssinian", "Sphynx"];
        const petNames = ["Buddy", "Max", "Bella", "Charlie", "Lucy", "Bailey", "Daisy", "Rocky", "Sadie", "Jack", "Molly", "Toby", "Maggie", "Jake", "Sophie", "Bear", "Lily", "Duke", "Zoe", "Bentley", "Coco", "Riley", "Gracie", "Teddy", "Rosie"];

        const pets = [];

        // Regular users start from index 1 (index 0 is admin)
        for (let userIndex = 1; userIndex <= 24; userIndex++) {
            // Each user gets 2 pets
            for (let petNum = 0; petNum < 2; petNum++) {
                const isDog = Math.random() > 0.4; // 60% dogs, 40% cats
                const species = isDog ? "Dog" : "Cat";
                const breeds = isDog ? dogBreeds : catBreeds;
                const breed = breeds[Math.floor(Math.random() * breeds.length)];
                const age = Math.floor(Math.random() * 15) + 1; // 1-15 years
                const baseWeight = isDog ? 20 : 8;
                const weight = Math.round((baseWeight + Math.random() * 30) * 10) / 10; // Vary weight

                pets.push({
                    name: petNames[(userIndex * 2 + petNum) % petNames.length] + (petNum > 0 ? petNum.toString() : ""),
                    species,
                    breed,
                    age,
                    weight,
                    ownerId: createdUsers[userIndex]._id
                });
            }
        }

        // Add 2 more pets to reach 50 total
        pets.push(
            {
                name: "Fluffy",
                species: "Cat",
                breed: "Persian",
                age: 3,
                weight: 12,
                ownerId: createdUsers[1]._id
            },
            {
                name: "Rex",
                species: "Dog",
                breed: "German Shepherd",
                age: 2,
                weight: 75,
                ownerId: createdUsers[2]._id
            }
        );

        const createdPets = await PetModel.insertMany(pets);
        console.log("Seeded pets:", createdPets.length);

        console.log("Database seeded successfully!");
        console.log("\nSample login credentials:");
        console.log("Admin: admin@pawcare.com / password123");
        console.log("User: john.doe@example.com / password123");
        console.log("Provider: contact@cityvetclinic@example.com / password123");
        console.log("\nTotal seeded data:");
        console.log(`- Users: ${createdUsers.length} (1 admin + 24 regular users)`);
        console.log(`- Providers: ${createdProviders.length}`);
        console.log(`- Pets: ${createdPets.length} (2 pets per user)`);

    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}

// Run the seed function
seedDatabase();