import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import type { Dependencies } from "../../core/dependencies.js";
import { createAuthRoutes } from "./auth.routes.js";

export function createAuthModule(dependencies: Dependencies) {

    const authService = new AuthService(
        dependencies.prisma,
        dependencies.tokenService,
        dependencies.passwordService,
    );

    const authController = new AuthController(authService);

    const authRoutes = createAuthRoutes(authController);

    return {
        service: authService,
        controller: authController,
        routes: authRoutes,
    };
}