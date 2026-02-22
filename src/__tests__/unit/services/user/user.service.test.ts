import { CreateUserDTO, LoginUserDTO, UpdateUserDto } from "../../../../dtos/user/user.dto";
import { HttpError } from "../../../../errors/http-error";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock dependencies
const mockUserRepository = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUserById: jest.fn(),
    updateAdminRole: jest.fn()
};

jest.mock("../../../../repositories/user/user.repository", () => ({
    UserRepository: jest.fn().mockImplementation(() => mockUserRepository)
}));
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../../config/email", () => ({
    sendEmail: jest.fn()
}));

// Import after mocking
import { UserService } from "../../../../services/user/user.service";

describe("UserService", () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create a new user successfully", async () => {
            const createUserDTO: CreateUserDTO = {
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
                Firstname: "John",
                Lastname: "Doe",
                phone: "1234567890",
                role: "user"
            };

            const hashedPassword = "hashedPassword123";
            const mockCreatedUser = {
                _id: "userId123",
                ...createUserDTO,
                password: hashedPassword,
                toObject: () => ({
                    _id: "userId123",
                    ...createUserDTO,
                    password: hashedPassword
                })
            };

            mockUserRepository.getUserByEmail.mockResolvedValue(null);
            (bcryptjs.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockUserRepository.createUser.mockResolvedValue(mockCreatedUser);

            const result = await userService.createUser(createUserDTO);

            expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(createUserDTO.email);
            expect(bcryptjs.hash).toHaveBeenCalledWith("password123", 10);
            expect(mockUserRepository.createUser).toHaveBeenCalled();
            expect(result).not.toHaveProperty("password");
            expect(result.email).toBe(createUserDTO.email);
        });

        it("should throw error if email already exists", async () => {
            const createUserDTO: CreateUserDTO = {
                email: "existing@example.com",
                password: "password123",
                confirmPassword: "password123",
                Firstname: "John",
                Lastname: "Doe",
                phone: "1234567890",
                role: "user"
            };

            mockUserRepository.getUserByEmail.mockResolvedValue({ email: "existing@example.com" });

            await expect(userService.createUser(createUserDTO)).rejects.toThrow(HttpError);
            await expect(userService.createUser(createUserDTO)).rejects.toThrow("Email is already in use");
        });
    });

    describe("loginUser", () => {
        it("should login user successfully with valid credentials", async () => {
            const loginDTO: LoginUserDTO = {
                email: "test@example.com",
                password: "password123"
            };

            const mockUser = {
                _id: "userId123",
                email: "test@example.com",
                password: "hashedPassword",
                Firstname: "John",
                Lastname: "Doe",
                role: "user",
                phone: "1234567890",
                toObject: function() {
                    return {
                        _id: this._id,
                        email: this.email,
                        password: this.password,
                        Firstname: this.Firstname,
                        Lastname: this.Lastname,
                        role: this.role,
                        phone: this.phone
                    };
                }
            };

            const mockToken = "jwt.token.here";

            mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);
            (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue(mockToken);

            const result = await userService.loginUser(loginDTO);

            expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(loginDTO.email);
            expect(bcryptjs.compare).toHaveBeenCalledWith(loginDTO.password, mockUser.password);
            expect(jwt.sign).toHaveBeenCalled();
            expect(result).toHaveProperty("token", mockToken);
            expect(result).toHaveProperty("user");
            expect(result.user).not.toHaveProperty("password");
        });

        it("should throw error if user not found", async () => {
            const loginDTO: LoginUserDTO = {
                email: "notfound@example.com",
                password: "password123"
            };

            mockUserRepository.getUserByEmail.mockResolvedValue(null);

            await expect(userService.loginUser(loginDTO)).rejects.toThrow(HttpError);
            await expect(userService.loginUser(loginDTO)).rejects.toThrow("User not found");
        });

        it("should throw error if password is invalid", async () => {
            const loginDTO: LoginUserDTO = {
                email: "test@example.com",
                password: "wrongpassword"
            };

            const mockUser = {
                _id: "userId123",
                email: "test@example.com",
                password: "hashedPassword",
                Firstname: "John",
                Lastname: "Doe",
                role: "user",
                phone: "1234567890"
            };

            mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);
            (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.loginUser(loginDTO)).rejects.toThrow(HttpError);
            await expect(userService.loginUser(loginDTO)).rejects.toThrow("Invalid credentials");
        });
    });

    describe("getUserById", () => {
        it("should return user when found", async () => {
            const userId = "userId123";
            const mockUser = {
                _id: userId,
                email: "test@example.com",
                Firstname: "John",
                Lastname: "Doe"
            };

            mockUserRepository.getUserById.mockResolvedValue(mockUser);

            const result = await userService.getUserById(userId);

            expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockUser);
        });

        it("should throw error if userId not provided", async () => {
            await expect(userService.getUserById("")).rejects.toThrow(HttpError);
            await expect(userService.getUserById("")).rejects.toThrow("User ID is required");
        });

        it("should throw error if user not found", async () => {
            mockUserRepository.getUserById.mockResolvedValue(null);

            await expect(userService.getUserById("invalidId")).rejects.toThrow(HttpError);
            await expect(userService.getUserById("invalidId")).rejects.toThrow("User not found");
        });
    });

    describe("makeAdmin", () => {
        it("should make user an admin successfully", async () => {
            const mockUser = {
                _id: "userId123",
                email: "test@example.com",
                role: "user"
            };

            const mockUpdatedUser = {
                ...mockUser,
                role: "admin"
            };

            mockUserRepository.getUserById.mockResolvedValue(mockUser);
            mockUserRepository.updateAdminRole.mockResolvedValue(mockUpdatedUser);

            const result = await userService.makeAdmin("userId123");

            expect(mockUserRepository.getUserById).toHaveBeenCalledWith("userId123");
            expect(mockUserRepository.updateAdminRole).toHaveBeenCalledWith("userId123", "admin");
            expect(result?.role).toBe("admin");
        });

        it("should throw error if userId not provided", async () => {
            await expect(userService.makeAdmin("")).rejects.toThrow(HttpError);
            await expect(userService.makeAdmin("")).rejects.toThrow("User ID is required");
        });

        it("should throw error if user not found", async () => {
            mockUserRepository.getUserById.mockResolvedValue(null);

            await expect(userService.makeAdmin("invalidId")).rejects.toThrow(HttpError);
            await expect(userService.makeAdmin("invalidId")).rejects.toThrow("User not found");
        });
    });

    describe("updateUser", () => {
        it("should update user successfully", async () => {
            const updateDto: UpdateUserDto = {
                Firstname: "Jane",
                phone: "9876543210"
            };

            const mockUser = {
                _id: "userId123",
                email: "test@example.com",
                Firstname: "John",
                Lastname: "Doe"
            };

            const mockUpdatedUser = {
                ...mockUser,
                ...updateDto
            };

            mockUserRepository.getUserById.mockResolvedValue(mockUser);
            mockUserRepository.updateUserById.mockResolvedValue(mockUpdatedUser);

            const result = await userService.updateUser("userId123", updateDto);

            expect(mockUserRepository.getUserById).toHaveBeenCalledWith("userId123");
            expect(mockUserRepository.updateUserById).toHaveBeenCalledWith("userId123", updateDto);
        });

        it("should throw error if user not found", async () => {
            const updateDto: UpdateUserDto = {
                Firstname: "Jane"
            };

            mockUserRepository.getUserById.mockResolvedValue(null);

            await expect(userService.updateUser("invalidId", updateDto)).rejects.toThrow(HttpError);
            await expect(userService.updateUser("invalidId", updateDto)).rejects.toThrow("User not found");
        });
    });
});
