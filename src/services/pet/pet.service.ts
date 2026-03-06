import { CreatePetDto, UpdatePetCareDto, UpdatePetDto } from "../../dtos/pet/pet.dto";
import { HttpError } from "../../errors/http-error";
import { PetRepository } from "../../repositories/pet/pet.repository";
import { ProviderRepository } from "../../repositories/provider/provider.repository";
import { ChatRepository } from "../../repositories/chat/chat.repository";
import { emitChatMessage } from "../../realtime/socket-server";

export class PetService {
    constructor(
        private petRepository = new PetRepository(),
        private providerRepository = new ProviderRepository(),
        private chatRepository = new ChatRepository()
    ) {}

    private isObjectId(value: string): boolean {
        return /^[a-fA-F0-9]{24}$/.test(value);
    }

    private normalizePetCare(pet: any) {
        const care = pet?.care || {};
        return {
            feedingTimes: Array.isArray(care.feedingTimes) ? care.feedingTimes : [],
            vaccinations: Array.isArray(care.vaccinations) ? care.vaccinations : [],
            notes: typeof care.notes === "string" ? care.notes : "",
            updatedAt: care.updatedAt || null,
        };
    }

    async createPet(ownerId: string, data: CreatePetDto) {
        if (!ownerId) {
            throw new HttpError(400, "Owner ID is required");
        }
        return this.petRepository.createPet(ownerId, data);
    }

    async getPetById(petId: string, ownerId: string, role?: string) {
        if (!petId) {
            throw new HttpError(400, "Pet ID is required");
        }
        const pet = await this.petRepository.getPetById(petId);
        if (!pet) {
            throw new HttpError(404, "Pet not found");
        }
        if (role !== "admin" && pet.ownerId?.toString() !== ownerId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        return pet;
    }

    async getAllPetsForUser(ownerId: string) {
        if (!ownerId) {
            throw new HttpError(400, "Owner ID is required");
        }
        return this.petRepository.getPetsByOwnerId(ownerId);
    }

    async getAllPets() {
        // Admin method - get all pets from all users
        return this.petRepository.getAllPets();
    }

    async updatePet(petId: string, ownerId: string, data: UpdatePetDto, role?: string) {
        const existing = await this.getPetById(petId, ownerId, role);
        if (!existing) {
            throw new HttpError(404, "Pet not found");
        }

        const updates = { ...(data as Record<string, any>) };

        if (Object.prototype.hasOwnProperty.call(updates, "assignedVetId")) {
            const nextVetIdRaw = updates.assignedVetId;
            const normalizedVetId = typeof nextVetIdRaw === "string" ? nextVetIdRaw.trim() : "";
            const previousVetId = existing.assignedVetId?.toString?.() || "";

            if (!normalizedVetId) {
                updates.assignedVetId = null;
                updates.assignedAt = null;
            } else {
                if (!this.isObjectId(normalizedVetId)) {
                    throw new HttpError(400, "Invalid vet id");
                }

                const vet = await this.providerRepository.getProviderById(normalizedVetId);
                if (!vet || vet.providerType !== "vet") {
                    throw new HttpError(404, "Vet provider not found");
                }
                if (vet.status !== "approved" || !vet.pawcareVerified) {
                    throw new HttpError(400, "Only approved PawCare verified vets can be assigned");
                }

                updates.assignedVetId = normalizedVetId;
                if (previousVetId !== normalizedVetId) {
                    updates.assignedAt = new Date();
                }
            }
        }

        const updated = await this.petRepository.updatePetById(petId, updates as UpdatePetDto);
        if (!updated) {
            throw new HttpError(404, "Pet not found");
        }

        const prevVet = existing.assignedVetId?.toString?.() || "";
        const nextVet = updated.assignedVetId?.toString?.() || "";
        const isAssignmentChanged = prevVet !== nextVet;
        if (isAssignmentChanged && nextVet) {
            const ownerName = (existing as any)?.name || "your pet";
            const starterMessage = await this.chatRepository.createMessage({
                content: `New pet assignment: ${ownerName}. You can ask questions here and share care advice.`,
                senderId: ownerId,
                senderRole: "user",
                receiverId: nextVet,
                receiverRole: "provider",
            });
            emitChatMessage(starterMessage);
        }

        return updated;
    }

    async assignVet(petId: string, ownerId: string, vetId: string | null, role?: string) {
        return this.updatePet(petId, ownerId, { assignedVetId: vetId || "" }, role);
    }

    async getAssignedPetsForVet(vetId: string, role?: string) {
        if (role !== "provider") {
            throw new HttpError(403, "Forbidden");
        }
        if (!this.isObjectId(vetId)) {
            throw new HttpError(400, "Invalid provider id");
        }

        const vet = await this.providerRepository.getProviderById(vetId);
        if (!vet || vet.providerType !== "vet") {
            throw new HttpError(403, "Only vet providers can access assigned pets");
        }

        const pets = await this.petRepository.getPetsByAssignedVetId(vetId);
        return pets.map((pet: any) => {
            const owner = pet?.ownerId;
            const assignedVet = pet?.assignedVetId;
            return {
                ...pet,
                owner: owner
                    ? {
                          _id: owner._id?.toString?.() || owner._id,
                          name: `${owner.Firstname || ""} ${owner.Lastname || ""}`.trim() || owner.email || "User",
                          email: owner.email || "",
                          imageUrl: owner.imageUrl || "",
                      }
                    : undefined,
                assignedVet: assignedVet
                    ? {
                          _id: assignedVet._id?.toString?.() || assignedVet._id,
                          name: assignedVet.businessName || assignedVet.clinicOrShopName || "Vet",
                          clinicOrShopName: assignedVet.clinicOrShopName || "",
                      }
                    : undefined,
            };
        });
    }

    async getPetCare(petId: string, ownerId: string, role?: string) {
        const pet = await this.getPetById(petId, ownerId, role);
        return this.normalizePetCare(pet);
    }

    async updatePetCare(petId: string, ownerId: string, data: UpdatePetCareDto, role?: string) {
        const existing = await this.getPetById(petId, ownerId, role);
        if (!existing) {
            throw new HttpError(404, "Pet not found");
        }
        const updated = await this.petRepository.updatePetCareById(petId, data);
        if (!updated) {
            throw new HttpError(404, "Pet not found");
        }
        return this.normalizePetCare(updated);
    }

    async deletePet(petId: string, ownerId: string, role?: string) {
        const existing = await this.getPetById(petId, ownerId, role);
        if (!existing) {
            throw new HttpError(404, "Pet not found");
        }
        const deleted = await this.petRepository.deletePetById(petId);
        if (!deleted) {
            throw new HttpError(404, "Pet not found");
        }
        return deleted;
    }
}
