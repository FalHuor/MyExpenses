import { fastify, type FastifyPluginAsync } from "fastify";

import { prisma } from "../../lib/prisma.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { tokenService } from "../../app.js"; 
import { passwordService } from "../../app.js";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const authService = new AuthService(prisma, tokenService, passwordService);
  const authController = new AuthController(authService);

  fastify.post("/register", authController.register);
  fastify.post("/login", authController.login);
}

export default authRoutes;