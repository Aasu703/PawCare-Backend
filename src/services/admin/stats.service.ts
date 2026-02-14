import { UserRepository } from "../../repositories/user/user.repository";
import { PetRepository } from "../../repositories/pet/pet.repository";
import { ProviderRepository } from "../../repositories/provider/provider.repository";
import { IUser } from "../../models/user/user.model";

export interface DashboardStats {
  totalPets: number;
  activeOwners: number;
  appointmentsToday: number;
  monthlyRevenue: number;
  weeklyAppointments: Array<{ day: string; count: number }>;
  revenueTrend: Array<{ month: string; revenue: number }>;
  recentAppointments: Array<{
    id: string;
    petName: string;
    ownerName: string;
    service: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
  }>;
}

export class AdminStatsService {
  private userRepository = new UserRepository();
  private petRepository = new PetRepository();
  private providerRepository = new ProviderRepository();

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get real data from repositories
      const [totalPets, allUsers, allProviders] = await Promise.all([
        this.petRepository.getAllPets(),
        this.userRepository.getAllUsers(),
        this.providerRepository.getAllProviders()
      ]);

      // Filter active owners (users with role "user")
      const activeOwners = allUsers.users.filter((user: IUser) => user.role === "user");

      // For now, return mock data for appointments and revenue
      // This can be updated when appointment/booking system is implemented
      const mockWeeklyAppointments = [
        { day: "Mon", count: 18 },
        { day: "Tue", count: 24 },
        { day: "Wed", count: 15 },
        { day: "Thu", count: 27 },
        { day: "Fri", count: 30 },
        { day: "Sat", count: 22 },
        { day: "Sun", count: 12 },
      ];

      const mockRevenueTrend = [
        { month: "Jan", revenue: 42000 },
        { month: "Feb", revenue: 45000 },
        { month: "Mar", revenue: 48000 },
        { month: "Apr", revenue: 52000 },
        { month: "May", revenue: 48532 },
      ];

      const mockRecentAppointments = [
        {
          id: "1",
          petName: "Max",
          ownerName: "John Smith",
          service: "Grooming",
          time: "9:00 AM",
          status: "scheduled" as const,
        },
        {
          id: "2",
          petName: "Bella",
          ownerName: "Sarah Johnson",
          service: "Checkup",
          time: "10:30 AM",
          status: "completed" as const,
        },
        {
          id: "3",
          petName: "Charlie",
          ownerName: "Mike Davis",
          service: "Vaccination",
          time: "11:00 AM",
          status: "scheduled" as const,
        },
        {
          id: "4",
          petName: "Luna",
          ownerName: "Emily Brown",
          service: "Dental Cleaning",
          time: "2:00 PM",
          status: "scheduled" as const,
        },
        {
          id: "5",
          petName: "Cooper",
          ownerName: "David Wilson",
          service: "Surgery",
          time: "3:30 PM",
          status: "cancelled" as const,
        },
      ];

      return {
        totalPets: totalPets.length,
        activeOwners: activeOwners.length,
        appointmentsToday: 24, // Mock data
        monthlyRevenue: 48532, // Mock data
        weeklyAppointments: mockWeeklyAppointments,
        revenueTrend: mockRevenueTrend,
        recentAppointments: mockRecentAppointments,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }
}