import mongoose from "mongoose";
import { UserModel } from "./models/user/user.model";
import { PetModel } from "./models/pet/pet.model";
import { ProviderModel } from "./models/provider/provider.model";
import { ServiceModel } from "./models/provider/service.model";
import { BookingModel } from "./models/user/booking.model";
import { ReviewModel } from "./models/user/review.model";
import { MessageModel } from "./models/user/message.model";
import { HealthRecordModel } from "./models/pet/healthrecord.model";
import { FeedbackModel } from "./models/provider/feedback.model";
import { InventoryModel } from "./models/provider/inventory.model";
import bcryptjs from "bcryptjs";
import { MONGO_URI } from "./config";

async function seedDatabase() {
    try {
        // Connect to database
        await mongoose.connect(MONGO_URI);
        console.log("Connected to database");

        // Clear ALL existing data
        await UserModel.deleteMany({});
        await PetModel.deleteMany({});
        await ProviderModel.deleteMany({});
        await ServiceModel.deleteMany({});
        await BookingModel.deleteMany({});
        await ReviewModel.deleteMany({});
        await MessageModel.deleteMany({});
        await HealthRecordModel.deleteMany({});
        await FeedbackModel.deleteMany({});
        await InventoryModel.deleteMany({});
        console.log("Cleared existing data");

        // ========== USERS ==========
        const hashedPassword = await bcryptjs.hash("password123", 10);
        const providerHashedPassword = await bcryptjs.hash("zxcvbnm@qwer1234", 10);

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

        // ========== PROVIDERS ==========
        const businessNames = [
            "City Vet Clinic", "Pawfect Grooming", "Smart Paws Training", "Happy Tails Vet", "Furry Friends Spa",
            "Pet Paradise Grooming", "Wagging Tails Training", "Animal Care Center", "Purrfect Paws Salon", "Bark Avenue Clinic",
            "Whisker Wonders Grooming", "Tail Waggers Academy", "Companion Animal Hospital", "Pet Pamper Palace", "Critter Care Clinic",
            "Fluffy Friends Grooming", "Obedience Masters", "Veterinary Excellence Center", "Grooming Galaxy", "Pet Behavior Pros",
            "Healthy Paws Hospital", "Luxury Pet Spa", "Training Titans", "Animal Wellness Clinic", "Supreme Grooming Studio"
        ];

        const providerCities = ["Springfield", "Riverside", "Meadowbrook", "Oakwood", "Pineville", "Maplewood", "Cedarburg", "Elmwood", "Birchwood", "Willowbrook"];

        const providers = [];

        // First provider uses special credentials (pawcareprovider@gmail.com)
        providers.push({
            businessName: "PawCare Provider Inc.",
            address: "Kathmandu Nepal",
            phone: "9876543210",
            email: "pawcareprovider@gmail.com",
            password: providerHashedPassword,
            rating: 4.5,
            role: "provider"
        });

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

        // ========== PETS ==========
        const dogBreeds = ["Golden Retriever", "German Shepherd", "Beagle", "Bulldog", "Poodle", "Labrador", "Siberian Husky", "Boxer", "Dachshund", "Chihuahua"];
        const catBreeds = ["Siamese", "Persian", "Maine Coon", "British Shorthair", "Ragdoll", "Bengal", "Scottish Fold", "Russian Blue", "Abyssinian", "Sphynx"];
        const petNames = ["Buddy", "Max", "Bella", "Charlie", "Lucy", "Bailey", "Daisy", "Rocky", "Sadie", "Jack", "Molly", "Toby", "Maggie", "Jake", "Sophie", "Bear", "Lily", "Duke", "Zoe", "Bentley", "Coco", "Riley", "Gracie", "Teddy", "Rosie"];
        const allergies = ["None", "Chicken", "Grain", "Dairy", "Beef", "Pollen", "Dust mites", "Fleas", "None", "None"];
        const dietNotes = ["Regular diet", "Grain-free diet", "High protein diet", "Weight management", "Senior formula", "Puppy formula", "Sensitive stomach", "Raw food diet", "Prescription diet", "Regular diet"];

        const pets = [];

        for (let userIndex = 1; userIndex <= 24; userIndex++) {
            for (let petNum = 0; petNum < 2; petNum++) {
                const isDog = Math.random() > 0.4;
                const species = isDog ? "Dog" : "Cat";
                const breeds = isDog ? dogBreeds : catBreeds;
                const breed = breeds[Math.floor(Math.random() * breeds.length)];
                const age = Math.floor(Math.random() * 15) + 1;
                const baseWeight = isDog ? 20 : 8;
                const weight = Math.round((baseWeight + Math.random() * 30) * 10) / 10;

                pets.push({
                    name: petNames[(userIndex * 2 + petNum) % petNames.length] + (petNum > 0 ? petNum.toString() : ""),
                    species,
                    breed,
                    age,
                    weight,
                    allergies: allergies[Math.floor(Math.random() * allergies.length)],
                    dietNotes: dietNotes[Math.floor(Math.random() * dietNotes.length)],
                    ownerId: createdUsers[userIndex]._id
                });
            }
        }

        pets.push(
            { name: "Fluffy", species: "Cat", breed: "Persian", age: 3, weight: 12, allergies: "None", dietNotes: "Regular diet", ownerId: createdUsers[1]._id },
            { name: "Rex", species: "Dog", breed: "German Shepherd", age: 2, weight: 75, allergies: "Grain", dietNotes: "Grain-free diet", ownerId: createdUsers[2]._id }
        );

        const createdPets = await PetModel.insertMany(pets);
        console.log("Seeded pets:", createdPets.length);

        // ========== SERVICES ==========
        const serviceTemplates = [
            // Grooming services
            { title: "Full Grooming Package", description: "Complete bath, haircut, nail trimming, ear cleaning, and blow dry", price: 75, duration_minutes: 90, catergory: "grooming", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
            { title: "Bath & Brush", description: "Thorough bath with premium shampoo and full coat brushing", price: 40, duration_minutes: 45, catergory: "grooming", availability: ["Monday", "Wednesday", "Friday"] },
            { title: "Nail Trimming", description: "Safe and gentle nail trimming for dogs and cats", price: 20, duration_minutes: 20, catergory: "grooming", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            { title: "De-shedding Treatment", description: "Specialized treatment to reduce shedding by up to 80%", price: 55, duration_minutes: 60, catergory: "grooming", availability: ["Tuesday", "Thursday", "Saturday"] },
            { title: "Puppy First Groom", description: "Gentle introduction grooming session for puppies under 6 months", price: 35, duration_minutes: 40, catergory: "grooming", availability: ["Monday", "Wednesday", "Friday"] },
            // Vet services
            { title: "General Health Checkup", description: "Comprehensive physical examination and health assessment", price: 60, duration_minutes: 30, catergory: "vet", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
            { title: "Vaccination Package", description: "Core vaccinations including rabies, distemper, and parvovirus", price: 120, duration_minutes: 30, catergory: "vet", availability: ["Monday", "Wednesday", "Friday"] },
            { title: "Dental Cleaning", description: "Professional teeth cleaning under sedation with full oral examination", price: 250, duration_minutes: 120, catergory: "vet", availability: ["Tuesday", "Thursday"] },
            { title: "Spay/Neuter Surgery", description: "Routine spay or neuter procedure with post-op care instructions", price: 350, duration_minutes: 180, catergory: "vet", availability: ["Monday", "Wednesday", "Friday"] },
            { title: "Emergency Consultation", description: "Urgent care consultation for acute illness or injury", price: 150, duration_minutes: 45, catergory: "vet", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
            { title: "Blood Work & Lab Tests", description: "Comprehensive blood panel and laboratory analysis", price: 90, duration_minutes: 30, catergory: "vet", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
            { title: "X-Ray & Imaging", description: "Digital radiography for diagnostic imaging", price: 180, duration_minutes: 45, catergory: "vet", availability: ["Monday", "Wednesday", "Friday"] },
            // Boarding services
            { title: "Day Boarding", description: "Full day care with playtime, meals, and supervision", price: 35, duration_minutes: 480, catergory: "boarding", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            { title: "Overnight Boarding", description: "Comfortable overnight stay with evening and morning meals", price: 55, duration_minutes: 720, catergory: "boarding", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
            { title: "Luxury Suite Boarding", description: "Premium private suite with webcam, extra playtime, and gourmet meals", price: 85, duration_minutes: 720, catergory: "boarding", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
        ];

        const services: any[] = [];
        for (let i = 0; i < createdProviders.length; i++) {
            // Each provider gets 3-5 services
            const numServices = 3 + Math.floor(Math.random() * 3);
            const shuffled = [...serviceTemplates].sort(() => Math.random() - 0.5);
            for (let j = 0; j < numServices; j++) {
                const template = shuffled[j % shuffled.length];
                services.push({
                    ...template,
                    price: Math.round(template.price * (0.8 + Math.random() * 0.4)), // vary price ±20%
                    providerId: createdProviders[i]._id.toString()
                });
            }
        }

        const createdServices = await ServiceModel.insertMany(services);
        console.log("Seeded services:", createdServices.length);

        // ========== BOOKINGS ==========
        const statuses = ["pending", "confirmed", "completed", "cancelled", "rejected"] as const;
        const bookingNotes = [
            "Please be gentle, pet is nervous",
            "First time visit",
            "Allergic to certain shampoos, please use hypoallergenic",
            "Needs medication at 2pm",
            "Owner will pick up by 5pm",
            "Extra playtime requested",
            "Senior pet, handle with extra care",
            "Puppy, needs gentle handling",
            "Regular client, knows the drill",
            ""
        ];

        const bookings: any[] = [];
        // Past bookings (completed/cancelled)
        for (let i = 0; i < 40; i++) {
            const userIdx = 1 + (i % 24); // skip admin
            const serviceIdx = i % createdServices.length;
            const petIdx = (userIdx - 1) * 2 + (i % 2);
            const daysAgo = 1 + Math.floor(Math.random() * 60);
            const hour = 8 + Math.floor(Math.random() * 8);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);
            startDate.setHours(hour, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setMinutes(endDate.getMinutes() + createdServices[serviceIdx].duration_minutes);

            bookings.push({
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                status: i < 30 ? "completed" : "cancelled",
                price: createdServices[serviceIdx].price,
                notes: bookingNotes[Math.floor(Math.random() * bookingNotes.length)],
                serviceId: createdServices[serviceIdx]._id.toString(),
                userId: createdUsers[userIdx]._id.toString(),
                petId: createdPets[petIdx < createdPets.length ? petIdx : 0]._id.toString()
            });
        }

        // Current/upcoming bookings (pending/confirmed)
        for (let i = 0; i < 25; i++) {
            const userIdx = 1 + (i % 24);
            const serviceIdx = (i + 10) % createdServices.length;
            const petIdx = (userIdx - 1) * 2 + (i % 2);
            const daysAhead = 1 + Math.floor(Math.random() * 14);
            const hour = 9 + Math.floor(Math.random() * 7);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + daysAhead);
            startDate.setHours(hour, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setMinutes(endDate.getMinutes() + createdServices[serviceIdx].duration_minutes);

            bookings.push({
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                status: i < 15 ? "confirmed" : "pending",
                price: createdServices[serviceIdx].price,
                notes: bookingNotes[Math.floor(Math.random() * bookingNotes.length)],
                serviceId: createdServices[serviceIdx]._id.toString(),
                userId: createdUsers[userIdx]._id.toString(),
                petId: createdPets[petIdx < createdPets.length ? petIdx : 0]._id.toString()
            });
        }

        const createdBookings = await BookingModel.insertMany(bookings);
        console.log("Seeded bookings:", createdBookings.length);

        // ========== REVIEWS ==========
        const reviewComments = [
            "Excellent service! My pet loved it.",
            "Very professional staff. Highly recommended!",
            "Good experience overall, will come back again.",
            "The grooming was perfect, my dog looks amazing!",
            "Friendly team but had to wait a bit longer than expected.",
            "Outstanding vet care. Dr. was very thorough.",
            "My cat was so calm after the visit, great handling!",
            "Fair pricing and wonderful service quality.",
            "The boarding facility was clean and well-maintained.",
            "Could improve the waiting area, but service was top-notch.",
            "My puppy's first visit and they made it so comfortable!",
            "Best grooming salon in town, no question!",
            "The vet explained everything clearly, very trustworthy.",
            "Convenient online booking and prompt service.",
            "Will definitely return for all our pet care needs.",
            "Wonderful experience from start to finish!",
            "Staff was very knowledgeable and caring.",
            "A bit pricey but worth every penny.",
            "Quick service without compromising quality.",
            "Loved the personalized attention to our senior dog."
        ];

        const reviews: any[] = [];
        for (let i = 0; i < 50; i++) {
            const userIdx = 1 + (i % 24);
            reviews.push({
                rating: 3 + Math.floor(Math.random() * 3), // 3-5 stars
                comment: reviewComments[i % reviewComments.length],
                userId: createdUsers[userIdx]._id.toString()
            });
        }

        const createdReviews = await ReviewModel.insertMany(reviews);
        console.log("Seeded reviews:", createdReviews.length);

        // ========== MESSAGES ==========
        const messageContents = [
            "Hi, I'd like to book an appointment for my dog next week.",
            "Can you confirm my booking for Saturday at 10am?",
            "What vaccinations does my puppy need at 3 months?",
            "Thank you for the great service today!",
            "Is there availability for grooming this Friday?",
            "My cat has been acting lethargic, should I bring her in?",
            "Do you offer any package deals for multiple services?",
            "Just wanted to confirm pickup time for boarding.",
            "Can I reschedule my appointment from Monday to Wednesday?",
            "My dog has a skin rash, is this urgent?",
            "Really appreciate how you handled my anxious pet!",
            "Do you accept pet insurance?",
            "What are your operating hours on weekends?",
            "Can you recommend a good diet for an overweight cat?",
            "The dental cleaning went great, thank you!",
            "I need to cancel my appointment for tomorrow.",
            "Is the vet available for a consultation today?",
            "My pet's medication is running low, can I get a refill?",
            "Do you have any openings for emergency visits?",
            "Thanks for the wonderful boarding experience!"
        ];

        const messages: any[] = [];
        for (let i = 0; i < 40; i++) {
            const userIdx = 1 + (i % 24);
            messages.push({
                content: messageContents[i % messageContents.length],
                userId: createdUsers[userIdx]._id.toString()
            });
        }

        const createdMessages = await MessageModel.insertMany(messages);
        console.log("Seeded messages:", createdMessages.length);

        // ========== HEALTH RECORDS ==========
        const recordTypes = ["Vaccination", "Checkup", "Surgery", "Dental", "Lab Test", "Medication", "Allergy Test"];
        const healthRecordTemplates = [
            { recordType: "Vaccination", title: "Rabies Vaccination", description: "Annual rabies vaccine administered" },
            { recordType: "Vaccination", title: "DHPP Vaccine", description: "Distemper, hepatitis, parainfluenza, parvovirus combo vaccine" },
            { recordType: "Vaccination", title: "Bordetella Vaccine", description: "Kennel cough prevention vaccine" },
            { recordType: "Checkup", title: "Annual Wellness Exam", description: "Full physical examination, weight check, heart and lung auscultation" },
            { recordType: "Checkup", title: "Puppy Wellness Visit", description: "Growth assessment, parasite check, nutrition counseling" },
            { recordType: "Dental", title: "Dental Cleaning", description: "Professional dental cleaning under anesthesia, tartar removal" },
            { recordType: "Surgery", title: "Spay Surgery", description: "Routine ovariohysterectomy performed successfully" },
            { recordType: "Surgery", title: "Neuter Surgery", description: "Routine castration performed successfully" },
            { recordType: "Lab Test", title: "Complete Blood Count", description: "CBC panel - all values within normal range" },
            { recordType: "Lab Test", title: "Urinalysis", description: "Urine analysis for kidney and bladder health assessment" },
            { recordType: "Medication", title: "Flea & Tick Prevention", description: "Monthly flea and tick preventative administered" },
            { recordType: "Medication", title: "Heartworm Prevention", description: "Monthly heartworm preventative prescribed" },
            { recordType: "Allergy Test", title: "Environmental Allergy Panel", description: "Testing for common environmental allergens" },
            { recordType: "Checkup", title: "Senior Pet Wellness Exam", description: "Comprehensive exam for senior pets including blood work screening" },
        ];

        const healthRecords: any[] = [];
        for (let i = 0; i < createdPets.length; i++) {
            // Each pet gets 2-4 health records
            const numRecords = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < numRecords; j++) {
                const template = healthRecordTemplates[(i + j) % healthRecordTemplates.length];
                const daysAgo = Math.floor(Math.random() * 365);
                const recordDate = new Date();
                recordDate.setDate(recordDate.getDate() - daysAgo);

                const nextDueDate = new Date(recordDate);
                nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);

                healthRecords.push({
                    recordType: template.recordType,
                    title: template.title,
                    description: template.description,
                    date: recordDate.toISOString().split('T')[0],
                    nextDueDate: template.recordType === "Vaccination" || template.recordType === "Medication"
                        ? nextDueDate.toISOString().split('T')[0]
                        : undefined,
                    attachmentsCount: Math.floor(Math.random() * 3),
                    petId: createdPets[i]._id.toString()
                });
            }
        }

        const createdHealthRecords = await HealthRecordModel.insertMany(healthRecords);
        console.log("Seeded health records:", createdHealthRecords.length);

        // ========== FEEDBACK ==========
        const feedbackTexts = [
            "Great experience with this provider! Very professional and caring.",
            "The staff was very friendly and my pet felt comfortable.",
            "Excellent facilities, very clean and well-organized.",
            "Would recommend to anyone looking for quality pet care.",
            "The pricing is fair for the quality of service provided.",
            "Quick and efficient service, didn't have to wait long.",
            "My pet was handled with so much care and love.",
            "The vet was very knowledgeable and explained everything.",
            "Beautiful grooming results, my dog looks fabulous!",
            "The boarding area is spacious and comfortable.",
            "Very attentive to my pet's special dietary needs.",
            "Online booking system works perfectly, very convenient.",
            "Staff remembered my pet's name - lovely personal touch!",
            "Could improve parking availability.",
            "The follow-up call after the visit was much appreciated.",
            "Transparent pricing with no hidden fees.",
            "My nervous cat was handled expertly.",
            "Clean and modern facility.",
            "The training sessions really helped with my dog's behavior.",
            "Highly professional team, will definitely return."
        ];

        const feedbacks: any[] = [];
        for (let i = 0; i < createdProviders.length; i++) {
            // Each provider gets 2-4 feedbacks from random users
            const numFeedbacks = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < numFeedbacks; j++) {
                const userIdx = 1 + ((i * 3 + j) % 24);
                feedbacks.push({
                    feedback: feedbackTexts[(i + j) % feedbackTexts.length],
                    providerId: createdProviders[i]._id.toString(),
                    userId: createdUsers[userIdx]._id.toString()
                });
            }
        }

        const createdFeedbacks = await FeedbackModel.insertMany(feedbacks);
        console.log("Seeded feedbacks:", createdFeedbacks.length);

        // ========== INVENTORY ==========
        const inventoryTemplates = [
            { product_name: "Premium Dog Shampoo", description: "Natural organic shampoo for sensitive skin", price: 18.99, category: "grooming" },
            { product_name: "Cat Conditioner", description: "Detangling and moisturizing conditioner for cats", price: 15.99, category: "grooming" },
            { product_name: "Nail Clippers (Small)", description: "Professional grade nail clippers for small pets", price: 12.99, category: "grooming" },
            { product_name: "Nail Clippers (Large)", description: "Professional grade nail clippers for large dogs", price: 14.99, category: "grooming" },
            { product_name: "Flea & Tick Shampoo", description: "Medicated shampoo for flea and tick treatment", price: 22.99, category: "medical" },
            { product_name: "Heartworm Tablets", description: "Monthly heartworm prevention tablets (box of 6)", price: 45.99, category: "medical" },
            { product_name: "Antibacterial Ear Drops", description: "Veterinary ear cleaning and infection prevention drops", price: 16.99, category: "medical" },
            { product_name: "Joint Supplements", description: "Glucosamine and chondroitin supplements for joint health", price: 29.99, category: "supplements" },
            { product_name: "Dental Chews (Pack of 30)", description: "Daily dental chews for fresh breath and clean teeth", price: 24.99, category: "dental" },
            { product_name: "Premium Dog Food (10kg)", description: "High-quality grain-free dog food", price: 54.99, category: "food" },
            { product_name: "Premium Cat Food (5kg)", description: "Balanced nutrition cat food with real fish", price: 38.99, category: "food" },
            { product_name: "Pet Bandages (Roll)", description: "Self-adhesive veterinary bandage roll", price: 8.99, category: "medical" },
            { product_name: "Deshedding Tool", description: "Professional deshedding grooming tool", price: 19.99, category: "grooming" },
            { product_name: "Pet Toothbrush Kit", description: "Complete dental hygiene kit for dogs and cats", price: 11.99, category: "dental" },
            { product_name: "Calming Spray", description: "Natural calming spray for anxious pets", price: 17.99, category: "wellness" },
            { product_name: "Flea Collar (Dog)", description: "8-month protection flea and tick collar", price: 32.99, category: "medical" },
            { product_name: "Puppy Training Pads (50 pack)", description: "Super absorbent puppy training pads", price: 21.99, category: "supplies" },
            { product_name: "Pet Carrier (Medium)", description: "Airline-approved pet carrier for medium pets", price: 49.99, category: "accessories" },
        ];

        const inventoryItems: any[] = [];
        for (let i = 0; i < createdProviders.length; i++) {
            // Each provider gets 4-8 inventory items
            const numItems = 4 + Math.floor(Math.random() * 5);
            const shuffled = [...inventoryTemplates].sort(() => Math.random() - 0.5);
            for (let j = 0; j < numItems; j++) {
                const template = shuffled[j % shuffled.length];
                inventoryItems.push({
                    product_name: template.product_name,
                    description: template.description,
                    quantity: 5 + Math.floor(Math.random() * 95), // 5-100 units
                    price: template.price,
                    category: template.category,
                    providerId: createdProviders[i]._id.toString()
                });
            }
        }

        const createdInventory = await InventoryModel.insertMany(inventoryItems);
        console.log("Seeded inventory items:", createdInventory.length);

        // ========== SUMMARY ==========
        console.log("\n========================================");
        console.log("Database seeded successfully!");
        console.log("========================================");
        console.log("\nSample login credentials:");
        console.log("Admin:    admin@pawcare.com / password123");
        console.log("User:     john.doe@example.com / password123");
        console.log("Provider: pawcareprovider@gmail.com / zxcvbnm@qwer1234");
        console.log("Provider: pawfectgrooming@example.com / password123");
        console.log("\nTotal seeded data:");
        console.log(`- Users: ${createdUsers.length} (1 admin + 24 regular users)`);
        console.log(`- Providers: ${createdProviders.length}`);
        console.log(`- Pets: ${createdPets.length}`);
        console.log(`- Services: ${createdServices.length}`);
        console.log(`- Bookings: ${createdBookings.length} (${bookings.filter(b => b.status === 'completed').length} completed, ${bookings.filter(b => b.status === 'cancelled').length} cancelled, ${bookings.filter(b => b.status === 'rejected').length} rejected, ${bookings.filter(b => b.status === 'confirmed').length} confirmed, ${bookings.filter(b => b.status === 'pending').length} pending)`);
        console.log(`- Reviews: ${createdReviews.length}`);
        console.log(`- Messages: ${createdMessages.length}`);
        console.log(`- Health Records: ${createdHealthRecords.length}`);
        console.log(`- Feedbacks: ${createdFeedbacks.length}`);
        console.log(`- Inventory Items: ${createdInventory.length}`);

    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}

// Run the seed function
seedDatabase();