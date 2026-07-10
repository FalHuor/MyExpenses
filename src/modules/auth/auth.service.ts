import { PrismaClient } from "../../../generated/prisma/client";
import { } from "../../services/tokenService";
import type { RegisterDto, LoginDto } from "./auth.schemas"
import { TokenService } from "../../services/tokenService"
import { PasswordService } from "../../services/passwordService"; 
import { InvalidCredentialsError } from "../../core/errors/invalidCredentialsError";
import { ConflictError } from "../../core/errors/conflictError";
import { ErrorCodes } from "../../core/errors/errorCodes";
import type { AppLogger } from "../../core/logger/logger.types";

export class AuthService {

  constructor(
    private prisma: PrismaClient,
    private tokenService: TokenService,
    private passwordService: PasswordService,
    private logger: AppLogger
  ) {}

  async register(dto: RegisterDto) {

    // Check if email is already used
    const existingUserEmail = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    });

    if (existingUserEmail) {
      throw new ConflictError(ErrorCodes.USER_EMAIL_ALREADY_EXISTS, "Email already exists");
    }

    // Check if username is already used if username field isn't empty
    if (dto.username) {
      const existingUserUsername = await this.prisma.user.findUnique({
        where: {
          username: dto.username,
        }
      });

      if (existingUserUsername) {
        throw new ConflictError(ErrorCodes.USER_USERNAME_ALREADY_EXISTS, "Username already exists");
      }
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(dto.password);

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        username: dto.username || null
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    this.logger.info({
      userId: user.id,
      email: user.email
    }, "User registerd")

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.login },
          { username: dto.login },
        ]
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const valid = await this.passwordService.verify(dto.password, user.password);

    if (!valid) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenService.signAccessToken({ 
      id: user.id, 
      email: user.email 
    });

    this.logger.info({
      userId: user.id,
      email: user.email
    }, "User logged in")

    return token;
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }, 
      select: {
        id: true,
        username: true,
        email: true
      }
    })

    return user;
  }
};