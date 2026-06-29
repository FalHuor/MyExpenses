import jwt from "jsonwebtoken";
import type { TokenServiceConfig } from "./tokenService.types";

export type AccessTokenPayload = {
  id: string;
  email: string;
};

export class TokenService {
  constructor (
    private config: TokenServiceConfig
  ){}

  createAccessToken(payload: object) {
    return jwt.sign(payload, this.config.secret, {
      expiresIn: this.config.expiresIn ?? "1h",
    });
  }

  verify (token: string) {
    return jwt.verify(token, this.config.secret);
  }
}