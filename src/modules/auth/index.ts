import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import type { Dependencies } from "../../core/dependencies.js";
import { createAuthRoutes } from "./auth.routes.js";
import { PrismaAuthRepository } from "./auth.repository.js";

export function createAuthModule(dependencies: Dependencies) {

    const authRepository = new PrismaAuthRepository(dependencies.prisma);
    const authService = new AuthService(
        dependencies.prisma,
        authRepository,
        dependencies.tokenService,
        dependencies.passwordService,
        dependencies.logger.child({ module: "auth" }),
    );

    const authController = new AuthController(authService);

    const authRoutes = createAuthRoutes(authController);

    return {
        service: authService,
        controller: authController,
        routes: authRoutes,
    };
}