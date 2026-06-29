import type { SignOptions } from "jsonwebtoken";

export type TokenServiceConfig = {
  secret: string;
  expiresIn?: SignOptions["expiresIn"];
}