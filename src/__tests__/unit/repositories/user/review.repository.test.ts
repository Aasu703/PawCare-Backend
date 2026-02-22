import { ReviewRepository } from "../../../../repositories/user/review.repository";
import { ReviewModel } from "../../../../models/user/review.model";
import { CreateReviewDto, UpdateReviewDto } from "../../../../dtos/user/review.dto";

jest.mock("../../../../models/user/review.model");

describe("ReviewRepository", () => {
    let reviewRepository: ReviewRepository;
    let mockReviewModel: jest.Mocked<typeof ReviewModel>;

    beforeEach(() => {
        reviewRepository = new ReviewRepository();
        mockReviewModel = ReviewModel as jest.Mocked<typeof ReviewModel>;
        jest.clearAllMocks();
    });

    describe("createReview", () => {
        it("should create a new review successfully", async () => {
            const createReviewDto: CreateReviewDto = {
                rating: 5,
                comment: "Excellent service!",
                providerId: "provider123"
            };

            const mockReview = {
                _id: "reviewId123",
                ...createReviewDto,
                userId: "userId123"
            };

            mockReviewModel.create = jest.fn().mockResolvedValue(mockReview);

            const result = await reviewRepository.createReview(createReviewDto, "userId123");

            expect(mockReviewModel.create).toHaveBeenCalledWith({
                ...createReviewDto,
                userId: "userId123"
            });
            expect(result).toEqual(mockReview);
        });
    });

    describe("getReviewById", () => {
        it("should return review when found", async () => {
            const mockReview = {
                _id: "reviewId123",
                rating: 5,
                comment: "Great!"
            };

            const mockExec = jest.fn().mockResolvedValue(mockReview);
            mockReviewModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await reviewRepository.getReviewById("reviewId123");

            expect(mockReviewModel.findById).toHaveBeenCalledWith("reviewId123");
            expect(result).toEqual(mockReview);
        });

        it("should return null when review not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockReviewModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await reviewRepository.getReviewById("invalidId");

            expect(result).toBeNull();
        });
    });

    describe("getAllReviews", () => {
        it("should return paginated reviews", async () => {
            const mockReviews = [
                { _id: "rev1", rating: 5 },
                { _id: "rev2", rating: 4 }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockReviews);
            const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            mockReviewModel.find = jest.fn().mockReturnValue({ skip: mockSkip });

            const mockCountExec = jest.fn().mockResolvedValue(25);
            mockReviewModel.countDocuments = jest.fn().mockReturnValue({ exec: mockCountExec });

            const result = await reviewRepository.getAllReviews(2, 10);

            expect(mockReviewModel.find).toHaveBeenCalled();
            expect(mockSkip).toHaveBeenCalledWith(10);
            expect(mockLimit).toHaveBeenCalledWith(10);
            expect(result.totalPages).toBe(3);
        });
    });

    describe("getReviewsByUserId", () => {
        it("should return reviews for a specific user", async () => {
            const mockReviews = [
                { _id: "rev1", userId: "userId123" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockReviews);
            mockReviewModel.find = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await reviewRepository.getReviewsByUserId("userId123");

            expect(mockReviewModel.find).toHaveBeenCalledWith({ userId: "userId123" });
            expect(result).toEqual(mockReviews);
        });
    });

    describe("updateReviewById", () => {
        it("should update review successfully", async () => {
            const updates: UpdateReviewDto = {
                rating: 4,
                comment: "Updated review"
            };

            const mockUpdatedReview = {
                _id: "reviewId123",
                ...updates
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedReview);
            mockReviewModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await reviewRepository.updateReviewById("reviewId123", updates);

            expect(mockReviewModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "reviewId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedReview);
        });
    });

    describe("deleteReviewById", () => {
        it("should delete review successfully", async () => {
            const mockDeletedReview = {
                _id: "reviewId123"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedReview);
            mockReviewModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await reviewRepository.deleteReviewById("reviewId123");

            expect(mockReviewModel.findByIdAndDelete).toHaveBeenCalledWith("reviewId123");
            expect(result).toEqual(mockDeletedReview);
        });
    });

    describe("getReviewsByProviderId", () => {
        it("should return paginated reviews for a provider", async () => {
            const mockReviews = [
                { _id: "rev1", providerId: "provider123" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockReviews);
            const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
            mockReviewModel.find = jest.fn().mockReturnValue({ sort: mockSort });

            const mockCountExec = jest.fn().mockResolvedValue(10);
            mockReviewModel.countDocuments = jest.fn().mockReturnValue({ exec: mockCountExec });

            const result = await reviewRepository.getReviewsByProviderId("provider123", 1, 5);

            expect(mockReviewModel.find).toHaveBeenCalledWith({ providerId: "provider123" });
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(result.totalPages).toBe(2);
        });
    });

    describe("getReviewsByProductId", () => {
        it("should return paginated reviews for a product", async () => {
            const mockReviews = [
                { _id: "rev1", productId: "product123" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockReviews);
            const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
            mockReviewModel.find = jest.fn().mockReturnValue({ sort: mockSort });

            const mockCountExec = jest.fn().mockResolvedValue(8);
            mockReviewModel.countDocuments = jest.fn().mockReturnValue({ exec: mockCountExec });

            const result = await reviewRepository.getReviewsByProductId("product123", 1, 5);

            expect(mockReviewModel.find).toHaveBeenCalledWith({ productId: "product123" });
            expect(result.totalPages).toBe(2);
        });
    });
});
