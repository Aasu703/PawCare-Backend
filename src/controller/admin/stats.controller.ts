import { Request, Response } from "express";
import { AdminStatsService } from "../../services/admin/stats.service";

const adminStatsService = new AdminStatsService();

export class AdminStatsController {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await adminStatsService.getDashboardStats();
      return res.status(200).json({
        success: true,
        message: "Dashboard stats fetched successfully",
        data: stats
      });
    } catch (error: Error | any) {
      console.error("Error in getDashboardStats:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }
}