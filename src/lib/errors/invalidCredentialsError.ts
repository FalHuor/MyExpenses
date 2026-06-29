import { AppError } from "./appError";
import { ErrorCodes } from "./errorCodes";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      401,
      ErrorCodes.AUTH_INVALID_CREDENTIALS,
      "Invalid credentials"
    );
  }
}