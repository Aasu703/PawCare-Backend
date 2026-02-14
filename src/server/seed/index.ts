/**
 * DEVELOPMENT SEED SCRIPT
 *
 * This script populates the database with development data for testing and development purposes.
 *
 * HOW TO RUN:
 * 1. Ensure MongoDB is running
 * 2. Set MONGO_URI environment variable if needed (defaults to mongodb://localhost:27017/pawcare)
 * 3. Run: npm run seed
 *
 * WHEN NOT TO USE:
 * - NEVER run this in production
 * - NEVER import this file into runtime code
 * - This script should only be executed manually during development setup
 *
 * SAFETY:
 * - Checks for existing data to prevent duplicates
 * - Uses identifiable emails for easy testing
 * - Logs all created entities clearly
 */

import * as bcrypt from 'bcryptjs';
import { connectdb } from '../../database/mongodb';
import { UserModel } from '../../models/user/user.model';
import { ProviderModel } from '../../models/provider/provider.model';
import { PetModel } from '../../models/pet/pet.model';
import { BookingModel } from '../../models/user/booking.model';
import { ReviewModel } from '../../models/user/review.model';
import { InventoryModel } from '../../models/provider/inventory.model';

import { usersSeed } from './users.seed';
import { providersSeed } from './providers.seed';
import { petsSeed } from './pets.seed';
import { bookingsSeed } from './bookings.seed';
import { reviewsSeed } from './reviews.seed';
import { inventorySeed } from './inventory.seed';

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to database
        await connectdb();
        console.log('✅ Connected to database');

        // Hash passwords for seed data
        const hashPassword = async (password: string) => {
            return await bcrypt.hash(password, 10);
        };

        // 1. Insert Users
        console.log('\n📝 Seeding users...');
        const createdUsers = [];
        for (const userData of usersSeed) {
            const existingUser = await UserModel.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`⚠️  User ${userData.email} already exists, skipping`);
                createdUsers.push(existingUser);
                continue;
            }

            const hashedPassword = await hashPassword(userData.password);
            const user = new UserModel({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            createdUsers.push(user);
            console.log(`✅ Created user: ${user.Firstname} ${user.Lastname} (${user.email})`);
        }

        // 2. Insert Providers
        console.log('\n🏢 Seeding providers...');
        const createdProviders = [];
        for (let i = 0; i < providersSeed.length; i++) {
            const providerData = providersSeed[i];
            const existingProvider = await ProviderModel.findOne({ email: providerData.email });
            if (existingProvider) {
                console.log(`⚠️  Provider ${providerData.email} already exists, skipping`);
                createdProviders.push(existingProvider);
                continue;
            }

            // For simplicity, link providers to the first user (you can modify this logic)
            const linkedUser = createdUsers[i % createdUsers.length];

            const hashedPassword = await hashPassword(providerData.password);
            const provider = new ProviderModel({
                ...providerData,
                password: hashedPassword,
                userId: linkedUser._id.toString()
            });
            await provider.save();
            createdProviders.push(provider);
            console.log(`✅ Created provider: ${provider.businessName} (${provider.providerType}) - ${provider.status}`);
        }

        // 3. Insert Pets
        console.log('\n🐾 Seeding pets...');
        const createdPets = [];
        for (let i = 0; i < petsSeed.length; i++) {
            const petData = petsSeed[i];
            // Link to users (distribute among users)
            const owner = createdUsers[i % createdUsers.length];

            const pet = new PetModel({
                ...petData,
                ownerId: owner._id
            });
            await pet.save();
            createdPets.push(pet);
            console.log(`✅ Created pet: ${pet.name} (${pet.species}) - Owner: ${owner.Firstname} ${owner.Lastname}`);
        }

        // 4. Insert Inventory (for shop providers)
        console.log('\n📦 Seeding inventory...');
        const shopProvider = createdProviders.find(p => p.providerType === 'shop');
        if (shopProvider) {
            for (const inventoryData of inventorySeed) {
                const inventory = new InventoryModel({
                    ...inventoryData,
                    providerId: shopProvider._id.toString()
                });
                await inventory.save();
                console.log(`✅ Created inventory: ${inventory.product_name} - $${inventory.price}`);
            }
        } else {
            console.log('⚠️  No shop provider found, skipping inventory seeding');
        }

        // 5. Insert Bookings
        console.log('\n📅 Seeding bookings...');
        const vetProvider = createdProviders.find(p => p.providerType === 'vet');
        const babysitterProvider = createdProviders.find(p => p.providerType === 'babysitter');

        for (let i = 0; i < bookingsSeed.length; i++) {
            const bookingData = bookingsSeed[i];
            const user = createdUsers[i % createdUsers.length];
            const pet = createdPets[i % createdPets.length];

            let providerId = '';
            if (bookingData.serviceId === 'pet-sitting' && babysitterProvider) {
                providerId = babysitterProvider._id.toString();
            } else if (vetProvider) {
                providerId = vetProvider._id.toString();
            }

            const booking = new BookingModel({
                ...bookingData,
                userId: user._id.toString(),
                petId: pet._id.toString(),
                providerId
            });
            await booking.save();
            console.log(`✅ Created booking: ${booking.serviceId} for ${pet.name} - ${booking.status}`);
        }

        // 6. Insert Reviews
        console.log('\n⭐ Seeding reviews...');
        for (let i = 0; i < reviewsSeed.length; i++) {
            const reviewData = reviewsSeed[i];
            const user = createdUsers[i % createdUsers.length];

            let providerId = null;
            let productId = null;

            if (reviewData.reviewType === 'provider') {
                const provider = createdProviders[i % createdProviders.length];
                providerId = provider._id.toString();
            } else if (reviewData.reviewType === 'product' && shopProvider) {
                // For simplicity, link to first inventory item
                const inventoryItem = await InventoryModel.findOne({ providerId: shopProvider._id.toString() });
                if (inventoryItem) {
                    productId = inventoryItem._id.toString();
                }
                providerId = shopProvider._id.toString();
            }

            const review = new ReviewModel({
                ...reviewData,
                userId: user._id.toString(),
                providerId,
                productId
            });
            await review.save();
            console.log(`✅ Created review: ${review.rating} stars - ${review.reviewType}`);
        }

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${createdUsers.length}`);
        console.log(`   Providers: ${createdProviders.length}`);
        console.log(`   Pets: ${createdPets.length}`);
        console.log(`   Inventory items: ${inventorySeed.length}`);
        console.log(`   Bookings: ${bookingsSeed.length}`);
        console.log(`   Reviews: ${reviewsSeed.length}`);

        console.log('\n🔐 Test Accounts:');
        console.log('   Admin: admin@pawcare.dev / admin123');
        console.log('   User: john.doe@pawcare.dev / password123');
        console.log('   Provider (Vet): vet@pawcare.dev / password123');
        console.log('   Provider (Shop): shop@pawcare.dev / password123');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed script
seedDatabase();