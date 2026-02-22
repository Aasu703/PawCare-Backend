import { UserRepository } from "../../../../repositories/user/user.repository";
import { UserModel } from "../../../../models/user/user.model";
import { CreateUserDTO } from "../../../../dtos/user/user.dto";

// Mock the UserModel
jest.mock("../../../../models/user/user.model");

describe("UserRepository", () => {
    let userRepository: UserRepository;
    let mockUserModel: jest.Mocked<typeof UserModel>;

    beforeEach(() => {
        userRepository = new UserRepository();
        mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create a new user successfully", async () => {
            const createUserDTO: CreateUserDTO = {
                email: "test@example.com",
                password: "hashedPassword",
                confirmPassword: "hashedPassword",
                Firstname: "John",
                Lastname: "Doe",
                phone: "1234567890",
                role: "user"
            };

            const mockUser = {
                _id: "userId123",
                ...createUserDTO
            };

            mockUserModel.create = jest.fn().mockResolvedValue(mockUser);

            const result = await userRepository.createUser(createUserDTO);

            expect(mockUserModel.create).toHaveBeenCalledWith({
                email: createUserDTO.email,
                password: createUserDTO.password,
                Firstname: createUserDTO.Firstname,
                Lastname: createUserDTO.Lastname,
                phone: createUserDTO.phone,
                role: createUserDTO.role
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe("getUserByEmail", () => {
        it("should return user when found", async () => {
            const mockUser = {
                _id: "userId123",
                email: "test@example.com",
                Firstname: "John",
                Lastname: "Doe"
            };

            const mockExec = jest.fn().mockResolvedValue(mockUser);
            mockUserModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.getUserByEmail("test@example.com");

            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(mockExec).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });

        it("should return null when user not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockUserModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.getUserByEmail("nonexistent@example.com");

            expect(result).toBeNull();
        });
    });

    describe("getUserByFullName", () => {
        it("should return user when found by full name", async () => {
            const mockUser = {
                _id: "userId123",
                fullName: "John Doe"
            };

            const mockExec = jest.fn().mockResolvedValue(mockUser);
            mockUserModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.getUserByFullName("John Doe");

            expect(mockUserModel.findOne).toHaveBeenCalledWith({ fullName: "John Doe" });
            expect(result).toEqual(mockUser);
        });
    });

    describe("getAllUsers", () => {
        it("should return paginated users with default pagination", async () => {
            const mockUsers = [
                { _id: "1", email: "user1@example.com" },
                { _id: "2", email: "user2@example.com" }
            ];

            const mockLimit = jest.fn().mockResolvedValue(mockUsers);
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            mockUserModel.find = jest.fn().mockReturnValue({ skip: mockSkip });
            mockUserModel.countDocuments = jest.fn().mockResolvedValue(20);

            const result = await userRepository.getAllUsers();

            expect(mockUserModel.find).toHaveBeenCalled();
            expect(mockSkip).toHaveBeenCalledWith(0);
            expect(mockLimit).toHaveBeenCalledWith(10);
            expect(mockUserModel.countDocuments).toHaveBeenCalled();
            expect(result).toEqual({
                users: mockUsers,
                total: 20,
                page: 1,
                limit: 10,
                totalPages: 2
            });
        });

        it("should return paginated users with custom pagination", async () => {
            const mockUsers = [{ _id: "3", email: "user3@example.com" }];

            const mockLimit = jest.fn().mockResolvedValue(mockUsers);
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            mockUserModel.find = jest.fn().mockReturnValue({ skip: mockSkip });
            mockUserModel.countDocuments = jest.fn().mockResolvedValue(25);

            const result = await userRepository.getAllUsers(3, 5);

            expect(mockSkip).toHaveBeenCalledWith(10); // (3 - 1) * 5
            expect(mockLimit).toHaveBeenCalledWith(5);
            expect(result.totalPages).toBe(5); // Math.ceil(25 / 5)
        });
    });

    describe("getUserById", () => {
        it("should return user when found by id", async () => {
            const mockUser = {
                _id: "userId123",
                email: "test@example.com"
            };

            const mockExec = jest.fn().mockResolvedValue(mockUser);
            mockUserModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.getUserById("userId123");

            expect(mockUserModel.findById).toHaveBeenCalledWith("userId123");
            expect(result).toEqual(mockUser);
        });

        it("should return null when user not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockUserModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.getUserById("nonexistentId");

            expect(result).toBeNull();
        });
    });

    describe("updateUserById", () => {
        it("should update and return user", async () => {
            const updates = {
                Firstname: "Jane",
                email: "jane@example.com"
            };

            const mockUpdatedUser = {
                _id: "userId123",
                ...updates
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedUser);
            mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.updateUserById("userId123", updates);

            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "userId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        it("should return null if user not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.updateUserById("nonexistentId", { email: "new@example.com" });

            expect(result).toBeNull();
        });
    });

    describe("deleteUserById", () => {
        it("should delete and return user", async () => {
            const mockDeletedUser = {
                _id: "userId123",
                email: "test@example.com"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedUser);
            mockUserModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.deleteUserById("userId123");

            expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith("userId123");
            expect(result).toEqual(mockDeletedUser);
        });

        it("should return null if user not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockUserModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.deleteUserById("nonexistentId");

            expect(result).toBeNull();
        });
    });

    describe("updateAdminRole", () => {
        it("should update user role to admin", async () => {
            const mockUpdatedUser = {
                _id: "userId123",
                role: "admin"
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedUser);
            mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.updateAdminRole("userId123", "admin");

            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "userId123",
                { role: "admin" },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        it("should update user role to provider", async () => {
            const mockUpdatedUser = {
                _id: "userId123",
                role: "provider"
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedUser);
            mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await userRepository.updateAdminRole("userId123", "provider");

            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "userId123",
                { role: "provider" },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });
    });
});
