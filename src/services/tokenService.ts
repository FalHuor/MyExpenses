import type { TokenServiceConfig } from "./tokenService.types";
import type { JwtPayload } from "../types/jwt";
import { InvalidTokenError } from "../core/errors/invalidTokenError";
import jwt from "jsonwebtoken";

export class TokenService implements ITokenService {
  constructor (
    private config: TokenServiceConfig
  ){}

  signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.config.secret, {
      expiresIn: this.config.expiresIn ?? "1h",
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.config.secret); 

      return payload as JwtPayload;
    }
    catch {
      throw new InvalidTokenError();
    }

  }
}

export interface ITokenService {
  signAccessToken(payload: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload;
}