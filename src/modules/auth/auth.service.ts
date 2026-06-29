import { PrismaClient } from "../../../generated/prisma/client";
import { } from "../../services/tokenService";
import type { RegisterDto, LoginDto } from "./auth.schemas"
import { TokenService } from "../../services/tokenService"
import { PasswordService } from "../../services/passwordService"; 
import { InvalidCredentialsError } from "../../lib/errors/invalidCredentialsError";
import { ConflictError } from "../../lib/errors/conflictError";
import { ErrorCodes } from "../../lib/errors/errorCodes";

export class AuthService {

  constructor(
    private prisma: PrismaClient,
    private tokenService: TokenService,
    private passwordService: PasswordService
  ) {}

  async register(dto: RegisterDto) {

    // Check if email is already used
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    });

    if (existingUser) {
      throw new ConflictError(ErrorCodes.USER_EMAIL_ALREADY_EXISTS, "Email already exists");
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

    const token = this.tokenService.createAccessToken({ 
      id: user.id, 
      email: user.email 
    });

    return token;
  }
};