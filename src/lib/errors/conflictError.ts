import { AppError } from "./appError";

export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(
      409,
      code, 
      message
    );
  }
}