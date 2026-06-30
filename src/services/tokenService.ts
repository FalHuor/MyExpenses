import type { TokenServiceConfig } from "./tokenService.types";
import type { JwtPayload } from "../types/jwt";
import { InvalidTokenError } from "../lib/errors/invalidTokenError";
import jwt from "jsonwebtoken";

export class TokenService {
  constructor (
    private config: TokenServiceConfig
  ){}

  signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.config.secret, {
      expiresIn: this.config.expiresIn ?? "1h",
    });
  }

  verifyAccessToken (token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.config.secret); 

      return payload as JwtPayload;
    }
    catch {
      throw new InvalidTokenError();
    }

  }
}