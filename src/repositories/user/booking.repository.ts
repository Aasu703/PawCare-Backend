import { BookingModel, IBooking } from "../../models/user/booking.model";
import { CreateBookingDto, UpdateBookingDto } from "../../dtos/user/booking.dto";
import { ServiceModel } from "../../models/provider/service.model";
import { ProviderModel } from "../../models/provider/provider.model";
import { PetModel } from "../../models/pet/pet.model";
import { UserModel } from "../../models/user/user.model";

export class BookingRepository {
    private async enrichBookingsWithProvider(bookings: any[]) {
        if (!bookings.length) return [];

        const serviceIds = Array.from(
            new Set(
                bookings
                    .map((b) => b?.serviceId?.toString?.() || b?.serviceId)
                    .filter(Boolean)
            )
        );

        const services = await ServiceModel.find({ _id: { $in: serviceIds } }).select("_id providerId title category").lean();
        const serviceMap = new Map(services.map((s: any) => [s._id.toString(), s]));

        const providerIdsFromBookings = bookings
            .map((b) => b?.providerId?.toString?.() || b?.providerId)
            .filter(Boolean);
        const providerIdsFromServices = services
            .map((s: any) => s?.providerId?.toString?.() || s?.providerId)
            .filter(Boolean);

        const providerIds = Array.from(new Set([...providerIdsFromBookings, ...providerIdsFromServices]));
        const providers = await ProviderModel.find({ _id: { $in: providerIds } }).select("_id businessName email").lean();
        const providerMap = new Map(providers.map((p: any) => [p._id.toString(), p]));

        const petIds = Array.from(
            new Set(
                bookings
                    .map((b) => b?.petId?.toString?.() || b?.petId)
                    .filter(Boolean)
            )
        );
        const pets = await PetModel.find({ _id: { $in: petIds } }).select("_id name species breed ownerId").lean();
        const petMap = new Map(pets.map((pet: any) => [pet._id.toString(), pet]));

        const bookingUserIds = bookings
            .map((b) => b?.userId?.toString?.() || b?.userId)
            .filter(Boolean);
        const ownerIds = pets
            .map((pet: any) => pet?.ownerId?.toString?.() || pet?.ownerId)
            .filter(Boolean);
        const userIds = Array.from(new Set([...bookingUserIds, ...ownerIds]));
        const users = await UserModel.find({ _id: { $in: userIds } }).select("_id Firstname Lastname email").lean();
        const userMap = new Map(
            users.map((u: any) => [
                u._id.toString(),
                {
                    _id: u._id,
                    name: `${u.Firstname || ""} ${u.Lastname || ""}`.trim(),
                    email: u.email,
                },
            ])
        );

        return bookings.map((booking: any) => {
            const plain = typeof booking.toObject === "function" ? booking.toObject() : booking;
            const serviceKey = plain?.serviceId?.toString?.() || plain?.serviceId;
            const service = serviceMap.get(serviceKey);
            const providerKey =
                plain?.providerId?.toString?.() ||
                plain?.providerId ||
                service?.providerId?.toString?.() ||
                service?.providerId;
            const provider = providerMap.get(providerKey?.toString?.() || providerKey);
            const petKey = plain?.petId?.toString?.() || plain?.petId;
            const pet = petMap.get(petKey?.toString?.() || petKey);
            const userKey =
                plain?.userId?.toString?.() ||
                plain?.userId ||
                pet?.ownerId?.toString?.() ||
                pet?.ownerId;
            const user = userMap.get(userKey?.toString?.() || userKey);

            return {
                ...plain,
                providerId: providerKey || plain?.providerId,
                provider: provider ? { _id: provider._id, businessName: provider.businessName, email: provider.email } : undefined,
                service: service ? { _id: service._id, title: service.title, category: (service as any).category || (service as any).catergory } : undefined,
                pet: pet ? { _id: pet._id, name: pet.name, species: pet.species, breed: pet.breed, ownerId: pet.ownerId } : undefined,
                user: user ? { _id: user._id, name: user.name, email: user.email } : undefined,
            };
        });
    }

    async createBooking(data: CreateBookingDto, userId: string): Promise<IBooking> {
        const booking = await BookingModel.create({
            startTime: data.startTime,
            endTime: data.endTime,
            serviceId: data.serviceId,
            petId: data.petId,
            notes: data.notes,
            providerId: data.providerId,
            providerServiceId: data.providerServiceId,
            userId: userId
        });
        return booking;
    }

    async getBookingById(id: string): Promise<IBooking | null> {
        const booking = await BookingModel.findById(id).exec();
        if (!booking) return null;
        const enriched = await this.enrichBookingsWithProvider([booking]);
        return (enriched[0] as any) || booking;
    }
    async getAllBookings(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const bookings = await BookingModel.find().skip(skip).limit(limit);
        const total = await BookingModel.countDocuments();
        return {
            bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async updateBookingById(id: string, updates: UpdateBookingDto): Promise<IBooking | null> {
        return BookingModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }
    async deleteBookingById(id: string): Promise<IBooking | null> {
        return BookingModel.findByIdAndDelete(id).exec();
    }
    async getBookingsByUserId(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        try {
            const bookings = await BookingModel.find({ userId }).sort({ startTime: -1 }).skip(skip).limit(limit).exec();
            return this.enrichBookingsWithProvider(bookings);
        } catch (error) {
            console.error('Error in getBookingsByUserId:', error);
            throw error;
        }
    }

    async countBookingsByUserId(userId: string) {
        try {
            return BookingModel.countDocuments({ userId }).exec();
        } catch (error) {
            console.error('Error in countBookingsByUserId:', error);
            throw error;
        }
    }

    async getBookingsByProviderId(providerId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const serviceIds = await ServiceModel.find({ providerId }).distinct("_id");
        const serviceIdStrings = serviceIds.map((id: any) => id.toString());

        const query = {
            $or: [
                { providerId },
                { serviceId: { $in: serviceIdStrings } },
            ],
        };

        const bookings = await BookingModel.find(query).sort({ startTime: -1 }).skip(skip).limit(limit).exec();
        const total = await BookingModel.countDocuments(query).exec();
        const enriched = await this.enrichBookingsWithProvider(bookings);
        return { bookings: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async hasConfirmedVetBookingForProvider(providerId: string, petId: string): Promise<boolean> {
        const bookings = await BookingModel.find({
            providerId,
            petId,
            status: { $in: ["confirmed", "completed"] },
        }).select("serviceId").lean();

        if (!bookings.length) return false;

        const serviceIds = bookings
            .map((booking: any) => booking?.serviceId?.toString?.() || booking?.serviceId)
            .filter(Boolean);

        // Legacy bookings may not include serviceId; allow if a confirmed/completed booking exists.
        if (!serviceIds.length) return true;

        const vetServicesCount = await ServiceModel.countDocuments({
            _id: { $in: serviceIds },
            $or: [{ category: "vet" }, { catergory: "vet" } as any],
        });

        return vetServicesCount > 0;
    }
    
}
