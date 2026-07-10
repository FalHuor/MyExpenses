import { AppError } from "./appError";
import { ErrorCodes } from "./errorCodes";

export class UnauthorizedError extends AppError {
  constructor() {
    super(
      401,
      ErrorCodes.AUTH_UNAUTHORIZED, 
      "Unauthorized"
    );
  }
}