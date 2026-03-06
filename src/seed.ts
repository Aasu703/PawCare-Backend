import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Support both MONGODB_URI and MONGO_URI
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/pawcare_db";
// ── Models ────────────────────────────────────────────────
import { UserModel } from "./models/user/user.model";
import { ProviderModel } from "./models/provider/provider.model";
import { ProviderServiceModel } from "./models/provider/provider-service.model";
import { PetModel } from "./models/pet/pet.model";
import { ServiceModel } from "./models/provider/service.model";
import { InventoryModel } from "./models/provider/inventory.model";
import { BookingModel } from "./models/user/booking.model";
import { OrderModel } from "./models/user/order.model";
import { ReviewModel } from "./models/user/review.model";
import { FeedbackModel } from "./models/provider/feedback.model";
import { HealthRecordModel } from "./models/pet/healthrecord.model";
import { PostModel } from "./models/provider/post.model";
import { MessageModel } from "./models/user/message.model";
import { NotificationModel } from "./models/user/notification.model";
import { ChatMessageModel } from "./models/chat/chat-message.model";
import { CartModel } from "./models/user/cart.model";
import { AttachmentModel } from "./models/pet/attachment.model";

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    // ── Clear all collections ─────────────────────────────
    await Promise.all([
        UserModel.deleteMany({}),
        ProviderModel.deleteMany({}),
        ProviderServiceModel.deleteMany({}),
        PetModel.deleteMany({}),
        ServiceModel.deleteMany({}),
        InventoryModel.deleteMany({}),
        BookingModel.deleteMany({}),
        OrderModel.deleteMany({}),
        ReviewModel.deleteMany({}),
        FeedbackModel.deleteMany({}),
        HealthRecordModel.deleteMany({}),
        PostModel.deleteMany({}),
        MessageModel.deleteMany({}),
        NotificationModel.deleteMany({}),
        ChatMessageModel.deleteMany({}),
        CartModel.deleteMany({}),
        AttachmentModel.deleteMany({}),
    ]);
    console.log("All collections cleared");

    // Hash password once, reuse for all accounts
    const hashedPassword = await bcryptjs.hash("Password123!", 10);

    // ══════════════════════════════════════════════════════
    // 1. USERS  (no dependencies)
    // ══════════════════════════════════════════════════════
    const users = await UserModel.insertMany([
        {
            email: "admin@pawcare.com",
            password: hashedPassword,
            Firstname: "Admin",
            Lastname: "User",
            phone: "1234567890",
            role: "admin",
        },
        {
            email: "john@example.com",
            password: hashedPassword,
            Firstname: "John",
            Lastname: "Smith",
            phone: "9876543210",
            role: "user",
        },
        {
            email: "sarah@example.com",
            password: hashedPassword,
            Firstname: "Sarah",
            Lastname: "Johnson",
            phone: "5551234567",
            role: "user",
        },
        {
            email: "mike@example.com",
            password: hashedPassword,
            Firstname: "Mike",
            Lastname: "Davis",
            phone: "5559876543",
            role: "user",
        },
        {
            email: "emily@example.com",
            password: hashedPassword,
            Firstname: "Emily",
            Lastname: "Brown",
            phone: "5554443322",
            role: "user",
        },
        {
            email: "vetprovider@example.com",
            password: hashedPassword,
            Firstname: "David",
            Lastname: "Wilson",
            phone: "5551112233",
            role: "provider",
        },
        {
            email: "shopprovider@example.com",
            password: hashedPassword,
            Firstname: "Lisa",
            Lastname: "Martinez",
            phone: "5556667788",
            role: "provider",
        },
        {
            email: "groomer@example.com",
            password: hashedPassword,
            Firstname: "Anna",
            Lastname: "Taylor",
            phone: "5553334455",
            role: "provider",
        },
    ]);
    console.log(`Seeded ${users.length} users`);

    const [admin, john, sarah, mike, emily, vetUser, shopUser, groomerUser] = users;

    // ══════════════════════════════════════════════════════
    // 2. PROVIDERS  (depends on: Users)
    // ══════════════════════════════════════════════════════
    const providers = await ProviderModel.insertMany([
        {
            businessName: "PawCare Vet Clinic",
            address: "123 Vet Lane, Springfield",
            phone: "5551112233",
            userId: vetUser._id,
            email: "vet@pawcareclinic.com",
            password: hashedPassword,
            rating: 4.8,
            role: "provider",
            providerType: "vet",
            status: "approved",
            certification: "DVM Licensed",
            certificationDocumentUrl: "",
            experience: "10 years in veterinary medicine",
            clinicOrShopName: "PawCare Vet Clinic",
            panNumber: "VET12345",
            bio: "Experienced veterinarian specializing in small animal care, surgery, and preventive medicine.",
            degree: "DVM from State University",
            profileImageUrl: "",
            appointmentFee: 500,
            ratingCount: 25,
            workingHours: "Monday - Friday at 8:00 am - 5:00pm",
            location: {
                latitude: 27.7172,
                longitude: 85.324,
                address: "123 Vet Lane, Springfield",
            },
            locationUpdatedAt: new Date(),
            locationVerified: true,
            locationVerifiedAt: new Date(),
            locationVerifiedBy: admin._id,
            pawcareVerified: true,
        },
        {
            businessName: "PawMart Pet Shop",
            address: "456 Shop Street, Springfield",
            phone: "5556667788",
            userId: shopUser._id,
            email: "shop@pawmart.com",
            password: hashedPassword,
            rating: 4.5,
            role: "provider",
            providerType: "shop",
            status: "approved",
            certification: "Business License",
            certificationDocumentUrl: "",
            experience: "5 years in pet retail",
            clinicOrShopName: "PawMart Pet Shop",
            panNumber: "SHOP67890",
            bio: "Your one-stop shop for pet food, toys, accessories, and supplies.",
            degree: "",
            profileImageUrl: "",
            appointmentFee: 0,
            ratingCount: 18,
            workingHours: "Monday - Saturday at 9:00 am - 7:00pm",
            location: {
                latitude: 27.7,
                longitude: 85.33,
                address: "456 Shop Street, Springfield",
            },
            locationUpdatedAt: new Date(),
            locationVerified: true,
            locationVerifiedAt: new Date(),
            locationVerifiedBy: admin._id,
            pawcareVerified: true,
        },
        {
            businessName: "Happy Paws Grooming",
            address: "789 Grooming Ave, Springfield",
            phone: "5553334455",
            userId: groomerUser._id,
            email: "grooming@happypaws.com",
            password: hashedPassword,
            rating: 4.6,
            role: "provider",
            providerType: "babysitter",
            status: "approved",
            certification: "Certified Pet Groomer",
            certificationDocumentUrl: "",
            experience: "7 years in pet grooming and care",
            clinicOrShopName: "Happy Paws Grooming",
            panNumber: "GPR45678",
            bio: "Professional grooming services including bathing, haircuts, nail trimming, and pet sitting.",
            degree: "",
            profileImageUrl: "",
            appointmentFee: 300,
            ratingCount: 12,
            workingHours: "Monday - Friday at 9:00 am - 6:00pm",
            location: {
                latitude: 27.71,
                longitude: 85.31,
                address: "789 Grooming Ave, Springfield",
            },
            locationUpdatedAt: new Date(),
            locationVerified: false,
            locationVerifiedAt: null,
            locationVerifiedBy: null,
            pawcareVerified: false,
        },
    ]);
    console.log(`Seeded ${providers.length} providers`);

    const [vetProvider, shopProvider, groomerProvider] = providers;

    // ══════════════════════════════════════════════════════
    // 3. PROVIDER SERVICES  (depends on: Users)
    // ══════════════════════════════════════════════════════
    const providerServices = await ProviderServiceModel.insertMany([
        {
            userId: vetUser._id,
            serviceType: "vet",
            verificationStatus: "approved",
            documents: [],
            registrationNumber: "VET-REG-001",
            bio: "Licensed veterinarian with specialization in small animals",
            experience: "10 years",
            ratingAverage: 4.8,
            ratingCount: 25,
            earnings: 125000,
        },
        {
            userId: shopUser._id,
            serviceType: "shop_owner",
            verificationStatus: "approved",
            documents: [],
            registrationNumber: "SHOP-REG-002",
            bio: "Pet supplies and accessories retailer",
            experience: "5 years",
            ratingAverage: 4.5,
            ratingCount: 18,
            earnings: 85000,
        },
        {
            userId: groomerUser._id,
            serviceType: "groomer",
            verificationStatus: "approved",
            documents: [],
            registrationNumber: "GROOM-REG-003",
            bio: "Professional pet groomer and caretaker",
            experience: "7 years",
            ratingAverage: 4.6,
            ratingCount: 12,
            earnings: 62000,
        },
    ]);
    console.log(`Seeded ${providerServices.length} provider services`);

    const [vetPS, _shopPS, groomerPS] = providerServices;

    // ══════════════════════════════════════════════════════
    // 4. PETS  (depends on: Users, Providers)
    // ══════════════════════════════════════════════════════
    const pets = await PetModel.insertMany([
        {
            name: "Max",
            species: "Dog",
            breed: "Golden Retriever",
            age: 3,
            weight: 30,
            imageUrl: "",
            allergies: "None",
            dietNotes: "Grain-free diet recommended",
            care: {
                feedingTimes: ["8:00 AM", "6:00 PM"],
                vaccinations: [
                    { vaccine: "Rabies", recommendedByMonths: 12, dosesTaken: 2, status: "done" },
                    { vaccine: "DHPP", recommendedByMonths: 12, dosesTaken: 3, status: "done" },
                    { vaccine: "Bordetella", recommendedByMonths: 6, dosesTaken: 1, status: "pending" },
                ],
                notes: "Very friendly, loves treats",
                updatedAt: new Date(),
            },
            ownerId: john._id,
            assignedVetId: vetProvider._id,
            assignedAt: new Date(),
        },
        {
            name: "Bella",
            species: "Cat",
            breed: "Persian",
            age: 2,
            weight: 4.5,
            imageUrl: "",
            allergies: "Chicken",
            dietNotes: "Fish-based diet only",
            care: {
                feedingTimes: ["7:30 AM", "12:00 PM", "6:30 PM"],
                vaccinations: [
                    { vaccine: "FVRCP", recommendedByMonths: 12, dosesTaken: 2, status: "done" },
                    { vaccine: "Rabies", recommendedByMonths: 12, dosesTaken: 1, status: "done" },
                ],
                notes: "Indoor cat, needs regular brushing",
                updatedAt: new Date(),
            },
            ownerId: sarah._id,
            assignedVetId: vetProvider._id,
            assignedAt: new Date(),
        },
        {
            name: "Charlie",
            species: "Dog",
            breed: "Labrador",
            age: 5,
            weight: 35,
            imageUrl: "",
            allergies: "Wheat",
            dietNotes: "High protein diet",
            care: {
                feedingTimes: ["7:00 AM", "5:00 PM"],
                vaccinations: [
                    { vaccine: "Rabies", recommendedByMonths: 12, dosesTaken: 3, status: "done" },
                    { vaccine: "DHPP", recommendedByMonths: 12, dosesTaken: 4, status: "done" },
                    { vaccine: "Leptospirosis", recommendedByMonths: 12, dosesTaken: 0, status: "pending" },
                ],
                notes: "Very active, needs daily exercise",
                updatedAt: new Date(),
            },
            ownerId: mike._id,
            assignedVetId: null,
            assignedAt: null,
        },
        {
            name: "Luna",
            species: "Cat",
            breed: "Siamese",
            age: 1,
            weight: 3.2,
            imageUrl: "",
            allergies: "None",
            dietNotes: "Standard kitten food",
            care: {
                feedingTimes: ["8:00 AM", "1:00 PM", "7:00 PM"],
                vaccinations: [
                    { vaccine: "FVRCP", recommendedByMonths: 12, dosesTaken: 1, status: "pending" },
                    { vaccine: "Rabies", recommendedByMonths: 12, dosesTaken: 0, status: "pending" },
                ],
                notes: "Playful kitten, needs socialization",
                updatedAt: new Date(),
            },
            ownerId: emily._id,
            assignedVetId: null,
            assignedAt: null,
        },
        {
            name: "Cooper",
            species: "Dog",
            breed: "Beagle",
            age: 4,
            weight: 12,
            imageUrl: "",
            allergies: "Dairy",
            dietNotes: "Limited ingredient diet",
            care: {
                feedingTimes: ["8:00 AM", "6:00 PM"],
                vaccinations: [
                    { vaccine: "Rabies", recommendedByMonths: 12, dosesTaken: 2, status: "done" },
                    { vaccine: "DHPP", recommendedByMonths: 12, dosesTaken: 3, status: "done" },
                ],
                notes: "Loves to sniff everything on walks",
                updatedAt: new Date(),
            },
            ownerId: john._id,
            assignedVetId: null,
            assignedAt: null,
        },
    ]);
    console.log(`Seeded ${pets.length} pets`);

    const [max, bella, charlie, luna, cooper] = pets;

    // ══════════════════════════════════════════════════════
    // 5. SERVICES  (depends on: Providers)
    // ══════════════════════════════════════════════════════
    const services = await ServiceModel.insertMany([
        {
            title: "General Health Checkup",
            description: "Comprehensive veterinary health examination including physical assessment and basic diagnostics.",
            price: 500,
            duration_minutes: 30,
            category: "vet",
            availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            providerId: vetProvider._id,
            approvalStatus: "approved",
        },
        {
            title: "Vaccination Package",
            description: "Core vaccinations including Rabies, DHPP, and Bordetella with full health screening.",
            price: 1200,
            duration_minutes: 45,
            category: "vet",
            availability: ["Monday", "Wednesday", "Friday"],
            providerId: vetProvider._id,
            approvalStatus: "approved",
        },
        {
            title: "Pet Surgery (Minor)",
            description: "Minor surgical procedures including spay/neuter, lump removal, and dental extractions.",
            price: 5000,
            duration_minutes: 120,
            category: "vet",
            availability: ["Tuesday", "Thursday"],
            providerId: vetProvider._id,
            approvalStatus: "approved",
        },
        {
            title: "Full Grooming Package",
            description: "Complete grooming service: bath, haircut, nail trim, ear cleaning, and teeth brushing.",
            price: 800,
            duration_minutes: 90,
            category: "grooming",
            availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            providerId: groomerProvider._id,
            approvalStatus: "approved",
        },
        {
            title: "Bath & Brush",
            description: "Basic bathing and brushing service for all breeds.",
            price: 400,
            duration_minutes: 45,
            category: "grooming",
            availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            providerId: groomerProvider._id,
            approvalStatus: "approved",
        },
        {
            title: "Pet Boarding (Daily)",
            description: "Safe and comfortable boarding facility with daily care, feeding, exercise, and monitoring.",
            price: 600,
            duration_minutes: 1440,
            category: "boarding",
            availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            providerId: groomerProvider._id,
            approvalStatus: "approved",
        },
    ]);
    console.log(`Seeded ${services.length} services`);

    const [checkupSvc, vaccinationSvc, surgerySvc, groomingSvc, bathSvc, boardingSvc] = services;

    // ══════════════════════════════════════════════════════
    // 6. INVENTORY  (depends on: Providers)
    // ══════════════════════════════════════════════════════
    const inventoryItems = await InventoryModel.insertMany([
        {
            product_name: "Premium Dog Food (10kg)",
            description: "High-quality grain-free dog food with real chicken and vegetables.",
            quantity: 50,
            price: 2500,
            category: "Food",
            providerId: shopProvider._id,
            approvalStatus: "approved",
        },
        {
            product_name: "Cat Food - Fish Delight (5kg)",
            description: "Premium fish-based cat food suitable for all life stages.",
            quantity: 40,
            price: 1800,
            category: "Food",
            providerId: shopProvider._id,
            approvalStatus: "approved",
        },
        {
            product_name: "Flea & Tick Collar",
            description: "8-month protection flea and tick collar for dogs.",
            quantity: 30,
            price: 800,
            category: "Health",
            providerId: shopProvider._id,
            approvalStatus: "approved",
        },
        {
            product_name: "Interactive Dog Toy Bundle",
            description: "Set of 5 interactive chew and fetch toys for dogs.",
            quantity: 25,
            price: 650,
            category: "Toys",
            providerId: shopProvider._id,
            approvalStatus: "approved",
        },
        {
            product_name: "Pet Shampoo - Oatmeal",
            description: "Gentle oatmeal shampoo for sensitive pet skin.",
            quantity: 60,
            price: 350,
            category: "Grooming",
            providerId: shopProvider._id,
            approvalStatus: "approved",
        },
        {
            product_name: "Cat Scratching Post",
            description: "Tall multi-level cat scratching post with sisal rope.",
            quantity: 15,
            price: 1200,
            category: "Accessories",
            providerId: shopProvider._id,
            approvalStatus: "approved",
        },
    ]);
    console.log(`Seeded ${inventoryItems.length} inventory items`);

    const [dogFood, catFood, fleaCollar, dogToys, petShampoo, scratchPost] = inventoryItems;

    // ══════════════════════════════════════════════════════
    // 7. BOOKINGS  (depends on: Users, Pets, Providers, Services, ProviderServices)
    // ══════════════════════════════════════════════════════
    const bookings = await BookingModel.insertMany([
        {
            startTime: "2025-01-15T09:00:00",
            endTime: "2025-01-15T09:30:00",
            status: "completed",
            price: 500,
            notes: "Annual checkup for Max",
            serviceId: checkupSvc._id.toString(),
            userId: john._id,
            petId: max._id,
            providerId: vetProvider._id,
            providerServiceId: vetPS._id,
        },
        {
            startTime: "2025-01-20T10:00:00",
            endTime: "2025-01-20T10:45:00",
            status: "completed",
            price: 1200,
            notes: "Core vaccination for Bella",
            serviceId: vaccinationSvc._id.toString(),
            userId: sarah._id,
            petId: bella._id,
            providerId: vetProvider._id,
            providerServiceId: vetPS._id,
        },
        {
            startTime: "2025-02-05T14:00:00",
            endTime: "2025-02-05T15:30:00",
            status: "completed",
            price: 800,
            notes: "Full grooming session for Charlie",
            serviceId: groomingSvc._id.toString(),
            userId: mike._id,
            petId: charlie._id,
            providerId: groomerProvider._id,
            providerServiceId: groomerPS._id,
        },
        {
            startTime: "2025-02-10T11:00:00",
            endTime: "2025-02-10T11:45:00",
            status: "confirmed",
            price: 400,
            notes: "Bath and brush for Luna",
            serviceId: bathSvc._id.toString(),
            userId: emily._id,
            petId: luna._id,
            providerId: groomerProvider._id,
            providerServiceId: groomerPS._id,
        },
        {
            startTime: "2025-02-15T09:00:00",
            endTime: "2025-02-15T09:30:00",
            status: "pending",
            price: 500,
            notes: "Follow-up checkup for Max",
            serviceId: checkupSvc._id.toString(),
            userId: john._id,
            petId: max._id,
            providerId: vetProvider._id,
            providerServiceId: vetPS._id,
        },
        {
            startTime: "2025-02-20T10:00:00",
            endTime: "2025-02-21T10:00:00",
            status: "pending",
            price: 600,
            notes: "One day boarding for Cooper",
            serviceId: boardingSvc._id.toString(),
            userId: john._id,
            petId: cooper._id,
            providerId: groomerProvider._id,
            providerServiceId: groomerPS._id,
        },
        {
            startTime: "2025-01-10T15:00:00",
            endTime: "2025-01-10T17:00:00",
            status: "cancelled",
            price: 5000,
            notes: "Surgery cancelled by owner",
            serviceId: surgerySvc._id.toString(),
            userId: mike._id,
            petId: charlie._id,
            providerId: vetProvider._id,
            providerServiceId: vetPS._id,
        },
    ]);
    console.log(`Seeded ${bookings.length} bookings`);

    const [bk1, bk2, bk3] = bookings;

    // ══════════════════════════════════════════════════════
    // 8. ORDERS  (depends on: Users, Inventory)
    // ══════════════════════════════════════════════════════
    await OrderModel.insertMany([
        {
            userId: john._id,
            items: [
                { productId: dogFood._id, productName: "Premium Dog Food (10kg)", quantity: 2, price: 2500 },
                { productId: dogToys._id, productName: "Interactive Dog Toy Bundle", quantity: 1, price: 650 },
            ],
            totalAmount: 5650,
            status: "delivered",
            shippingAddress: "123 Main St, Springfield",
            notes: "Please leave at door",
        },
        {
            userId: sarah._id,
            items: [
                { productId: catFood._id, productName: "Cat Food - Fish Delight (5kg)", quantity: 1, price: 1800 },
                { productId: scratchPost._id, productName: "Cat Scratching Post", quantity: 1, price: 1200 },
            ],
            totalAmount: 3000,
            status: "shipped",
            shippingAddress: "456 Oak Ave, Springfield",
            notes: "",
        },
        {
            userId: mike._id,
            items: [
                { productId: fleaCollar._id, productName: "Flea & Tick Collar", quantity: 1, price: 800 },
                { productId: petShampoo._id, productName: "Pet Shampoo - Oatmeal", quantity: 2, price: 350 },
            ],
            totalAmount: 1500,
            status: "confirmed",
            shippingAddress: "789 Elm Rd, Springfield",
            notes: "Call before delivery",
        },
        {
            userId: emily._id,
            items: [
                { productId: catFood._id, productName: "Cat Food - Fish Delight (5kg)", quantity: 2, price: 1800 },
            ],
            totalAmount: 3600,
            status: "pending",
            shippingAddress: "321 Pine St, Springfield",
            notes: "",
        },
    ]);
    console.log("Seeded 4 orders");

    // ══════════════════════════════════════════════════════
    // 9. REVIEWS  (userId, providerId etc. are STRINGS)
    // ══════════════════════════════════════════════════════
    await ReviewModel.insertMany([
        {
            rating: 5,
            comment: "Excellent vet care! Max was treated wonderfully. Dr. Wilson is amazing.",
            userId: john._id.toString(),
            providerId: vetProvider._id.toString(),
            providerServiceId: vetPS._id.toString(),
            bookingId: bk1._id.toString(),
            reviewType: "provider",
        },
        {
            rating: 4,
            comment: "Great vaccination service. Bella was nervous but the staff handled it well.",
            userId: sarah._id.toString(),
            providerId: vetProvider._id.toString(),
            providerServiceId: vetPS._id.toString(),
            bookingId: bk2._id.toString(),
            reviewType: "provider",
        },
        {
            rating: 5,
            comment: "Charlie looks amazing after grooming! Will definitely come back.",
            userId: mike._id.toString(),
            providerId: groomerProvider._id.toString(),
            providerServiceId: groomerPS._id.toString(),
            bookingId: bk3._id.toString(),
            reviewType: "provider",
        },
        {
            rating: 4,
            comment: "Good quality dog food. My dog loves it!",
            userId: john._id.toString(),
            productId: dogFood._id.toString(),
            reviewType: "product",
        },
        {
            rating: 5,
            comment: "The scratching post is perfect. My cat uses it every day.",
            userId: sarah._id.toString(),
            productId: scratchPost._id.toString(),
            reviewType: "product",
        },
    ]);
    console.log("Seeded 5 reviews");

    // ══════════════════════════════════════════════════════
    // 10. FEEDBACK  (depends on: Providers, Users, Bookings)
    // ══════════════════════════════════════════════════════
    await FeedbackModel.insertMany([
        {
            feedback: "John was punctual and cooperative during Max's checkup. Great pet owner!",
            providerId: vetProvider._id,
            userId: john._id,
            bookingId: bk1._id,
        },
        {
            feedback: "Sarah took excellent care of Bella before the visit. Pet was well-prepared.",
            providerId: vetProvider._id,
            userId: sarah._id,
            bookingId: bk2._id,
        },
        {
            feedback: "Mike brought Charlie in great condition. Easy grooming session.",
            providerId: groomerProvider._id,
            userId: mike._id,
            bookingId: bk3._id,
        },
    ]);
    console.log("Seeded 3 feedbacks");

    // ══════════════════════════════════════════════════════
    // 11. HEALTH RECORDS  (petId is STRING)
    // ══════════════════════════════════════════════════════
    await HealthRecordModel.insertMany([
        {
            recordType: "checkup",
            title: "Annual Health Checkup",
            description: "Complete physical exam. Weight: 30kg. Heart rate normal. Lungs clear. Teeth in good condition. All vitals within normal range. Recommended annual boosters.",
            date: "2025-01-15",
            nextDueDate: "2026-01-15",
            attachmentsCount: 0,
            petId: max._id.toString(),
        },
        {
            recordType: "vaccination",
            title: "FVRCP & Rabies Vaccination",
            description: "Administered FVRCP booster (dose 2) and Rabies vaccine (dose 1). Weight: 4.5kg. No adverse reactions observed. Monitor for 24 hours.",
            date: "2025-01-20",
            nextDueDate: "2026-01-20",
            attachmentsCount: 0,
            petId: bella._id.toString(),
        },
        {
            recordType: "dental",
            title: "Dental Examination",
            description: "Dental check performed. Minor tartar buildup on back molars. Recommended dental cleaning in 3 months. No extractions needed at this time.",
            date: "2025-01-25",
            nextDueDate: "2025-04-25",
            attachmentsCount: 0,
            petId: charlie._id.toString(),
        },
        {
            recordType: "allergy",
            title: "Allergy Assessment",
            description: "Chicken allergy confirmed via elimination diet. Switched to fish-based diet. Skin condition improving. Follow up in 2 months.",
            date: "2025-01-05",
            nextDueDate: "2025-03-05",
            attachmentsCount: 0,
            petId: bella._id.toString(),
        },
        {
            recordType: "checkup",
            title: "First Kitten Checkup",
            description: "Initial health screening. Weight: 3.2kg. Healthy development. Started vaccination schedule. Deworming administered.",
            date: "2025-01-10",
            nextDueDate: "2025-04-10",
            attachmentsCount: 0,
            petId: luna._id.toString(),
        },
    ]);
    console.log("Seeded 5 health records");

    // ══════════════════════════════════════════════════════
    // 12. POSTS  (providerId is STRING)
    // ══════════════════════════════════════════════════════
    await PostModel.insertMany([
        {
            title: "Winter Pet Care Tips",
            content: "As winter approaches, keep your pets warm and safe. Limit outdoor time in extreme cold. Check paws for ice and salt after walks. Ensure fresh water is always available.",
            providerId: vetProvider._id.toString(),
            providerName: "PawCare Vet Clinic",
            isPublic: true,
        },
        {
            title: "New Arrivals at PawMart!",
            content: "We just received a fresh batch of premium pet food, organic treats, and eco-friendly toys. Visit us this weekend for special discounts!",
            providerId: shopProvider._id.toString(),
            providerName: "PawMart Pet Shop",
            isPublic: true,
        },
        {
            title: "Grooming Schedule Update",
            content: "We now accept appointments on Saturdays! Book your pet's grooming session and enjoy our new aromatherapy bath option.",
            providerId: groomerProvider._id.toString(),
            providerName: "Happy Paws Grooming",
            isPublic: true,
        },
        {
            title: "Internal: Staff Meeting Notes",
            content: "Reminder: monthly team meeting on the 1st. Review new inventory procedures and vaccination protocols.",
            providerId: vetProvider._id.toString(),
            providerName: "PawCare Vet Clinic",
            isPublic: false,
        },
    ]);
    console.log("Seeded 4 posts");

    // ══════════════════════════════════════════════════════
    // 13. MESSAGES  (depends on: Users)
    // ══════════════════════════════════════════════════════
    await MessageModel.insertMany([
        { content: "When is my next appointment for Max?", userId: john._id },
        { content: "Can I reschedule Bella's vaccination?", userId: sarah._id },
        { content: "Do you carry grain-free food for dogs with allergies?", userId: mike._id },
        { content: "Thank you for the great service!", userId: emily._id },
    ]);
    console.log("Seeded 4 messages");

    // ══════════════════════════════════════════════════════
    // 14. NOTIFICATIONS  (depends on: Users)
    // ══════════════════════════════════════════════════════
    await NotificationModel.insertMany([
        {
            userId: john._id,
            title: "Booking Confirmed",
            body: "Your checkup appointment for Max on Jan 15 has been confirmed.",
            type: "booking",
            isRead: true,
        },
        {
            userId: sarah._id,
            title: "Vaccination Reminder",
            body: "Bella's vaccination appointment is scheduled for Jan 20.",
            type: "booking",
            isRead: true,
        },
        {
            userId: john._id,
            title: "Order Delivered",
            body: "Your order has been delivered successfully.",
            type: "order",
            isRead: true,
        },
        {
            userId: mike._id,
            title: "Grooming Appointment",
            body: "Your grooming session for Charlie is confirmed for Feb 5.",
            type: "booking",
            isRead: false,
        },
        {
            userId: emily._id,
            title: "Welcome to PawCare!",
            body: "Thank you for joining PawCare. Explore our services and book your first appointment.",
            type: "system",
            isRead: false,
        },
    ]);
    console.log("Seeded 5 notifications");

    // ══════════════════════════════════════════════════════
    // 15. CHAT MESSAGES  (senderId/receiverId are ObjectIds)
    // ══════════════════════════════════════════════════════
    await ChatMessageModel.insertMany([
        {
            content: "Hi Dr. Wilson, I have a question about Max's diet after the checkup.",
            senderId: john._id,
            senderRole: "user",
            receiverId: vetProvider._id,
            receiverRole: "provider",
        },
        {
            content: "Hello John! Sure, what would you like to know?",
            senderId: vetProvider._id,
            senderRole: "provider",
            receiverId: john._id,
            receiverRole: "user",
        },
        {
            content: "Should I switch him to a senior diet? He's turning 4 this year.",
            senderId: john._id,
            senderRole: "user",
            receiverId: vetProvider._id,
            receiverRole: "provider",
        },
        {
            content: "At 4 years old, a Golden Retriever doesn't need senior food yet. Continue his current adult food.",
            senderId: vetProvider._id,
            senderRole: "provider",
            receiverId: john._id,
            receiverRole: "user",
        },
        {
            content: "Hi! I'd like to schedule a grooming appointment for my cat.",
            senderId: sarah._id,
            senderRole: "user",
            receiverId: groomerProvider._id,
            receiverRole: "provider",
        },
        {
            content: "Of course! What breed is your cat? We have special packages for long-haired breeds.",
            senderId: groomerProvider._id,
            senderRole: "provider",
            receiverId: sarah._id,
            receiverRole: "user",
        },
    ]);
    console.log("Seeded 6 chat messages");

    // ══════════════════════════════════════════════════════
    // 16. CARTS  (depends on: Users, Inventory, Providers)
    // ══════════════════════════════════════════════════════
    await CartModel.insertMany([
        {
            userId: emily._id,
            items: [
                { productId: catFood._id, productName: "Cat Food - Fish Delight (5kg)", quantity: 1, price: 1800, providerId: shopProvider._id },
                { productId: petShampoo._id, productName: "Pet Shampoo - Oatmeal", quantity: 1, price: 350, providerId: shopProvider._id },
            ],
        },
        {
            userId: mike._id,
            items: [
                { productId: dogFood._id, productName: "Premium Dog Food (10kg)", quantity: 1, price: 2500, providerId: shopProvider._id },
            ],
        },
    ]);
    console.log("Seeded 2 carts");

    // ══════════════════════════════════════════════════════
    // Summary
    // ══════════════════════════════════════════════════════
    console.log("\n✅ Seed completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Login credentials (all passwords: Password123!):");
    console.log("  Admin:     admin@pawcare.com");
    console.log("  Users:     john@example.com, sarah@example.com, mike@example.com, emily@example.com");
    console.log("  Providers: vet@pawcareclinic.com, shop@pawmart.com, grooming@happypaws.com");
    console.log("  (Provider login uses Provider email, not User email)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
