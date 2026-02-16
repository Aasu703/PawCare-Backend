// bookings.seed.ts - Development seed data for bookings
// This file exports plain data objects for seeding the Booking collection
// No database imports or operations here

export const bookingsSeed = [
    {
        startTime: "2024-02-15T10:00:00Z",
        endTime: "2024-02-15T11:00:00Z",
        status: "confirmed" as const,
        price: 75.00,
        notes: "Annual checkup for Max",
        serviceId: "checkup",
        userId: "", // Will be set to user ID
        petId: "", // Will be set to pet ID
        providerId: "" // Will be set to vet provider ID
    },
    {
        startTime: "2024-02-16T14:00:00Z",
        endTime: "2024-02-16T15:00:00Z",
        status: "pending" as const,
        price: 50.00,
        notes: "Vaccination appointment",
        serviceId: "vaccination",
        userId: "", // Will be set to user ID
        petId: "", // Will be set to pet ID
        providerId: "" // Will be set to vet provider ID
    },
    {
        startTime: "2024-02-17T09:00:00Z",
        endTime: "2024-02-17T12:00:00Z",
        status: "completed" as const,
        price: 120.00,
        notes: "Pet sitting for Bella",
        serviceId: "pet-sitting",
        userId: "", // Will be set to user ID
        petId: "", // Will be set to pet ID
        providerId: "" // Will be set to babysitter provider ID
    },
    {
        startTime: "2024-02-18T16:00:00Z",
        endTime: "2024-02-18T17:00:00Z",
        status: "cancelled" as const,
        price: 60.00,
        notes: "Cancelled - pet not feeling well",
        serviceId: "grooming",
        userId: "", // Will be set to user ID
        petId: "", // Will be set to pet ID
        providerId: "" // Will be set to vet provider ID
    }
];