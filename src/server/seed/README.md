# Development Seed Data

This directory contains development seed scripts for populating the PawCare database with test data.

## How to Run

1. Ensure MongoDB is running locally
2. Set the `MONGO_URI` environment variable if needed (defaults to `mongodb://localhost:27017/pawcare`)
3. Run the seed script:
   ```bash
   npm run seed
   ```

## When NOT to Use

- **NEVER** run this in production environments
- **NEVER** import these files into runtime application code
- **NEVER** auto-run seeds in deployment scripts
- Only execute manually during local development setup

## What Gets Seeded

- **Users**: Admin, regular users with identifiable emails
- **Providers**: Vet clinic, pet shop, babysitter service (approved + pending)
- **Pets**: Dogs, cats, birds, fish linked to users
- **Inventory**: Pet products for the shop provider
- **Bookings**: Vet appointments and pet sitting bookings
- **Reviews**: Provider and product reviews

## Test Accounts

- **Admin**: `admin@pawcare.dev` / `admin123`
- **User**: `john.doe@pawcare.dev` / `password123`
- **Vet Provider**: `vet@pawcare.dev` / `password123`
- **Shop Provider**: `shop@pawcare.dev` / `password123`

## Safety Features

- Prevents duplicate insertions by checking existing records
- Uses hashed passwords for security
- Logs all created entities clearly
- Links related entities properly (pets to owners, bookings to pets/providers, etc.)

## File Structure

- `index.ts`: Main seed script that orchestrates data insertion
- `users.seed.ts`: User account data
- `providers.seed.ts`: Provider business data
- `pets.seed.ts`: Pet information
- `inventory.seed.ts`: Product catalog
- `bookings.seed.ts`: Appointment data
- `reviews.seed.ts`: Rating and feedback data