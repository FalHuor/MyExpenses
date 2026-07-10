import { AppError } from "./appError";
import { ErrorCodes } from "./errorCodes";

export class InvalidTokenError extends AppError {
  constructor() {
    super(
      401,
      ErrorCodes.AUTH_INVALID_TOKEN, 
      "Invalid token error"
    );
  }
}