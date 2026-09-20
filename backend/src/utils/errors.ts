export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = 'INVALID_REQUEST') {
    super(400, code, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code = 'NOT_FOUND') {
    super(404, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = 'DUPLICATE_FAVORITE') {
    super(409, code, message);
  }
}

export class ExternalApiError extends AppError {
  constructor(message = 'External API unavailable', statusCode = 502) {
    super(statusCode, 'EXTERNAL_API_ERROR', message);
  }
}

export class DependencyUnavailableError extends AppError {
  constructor(message = 'Required dependency unavailable') {
    super(503, 'DEPENDENCY_UNAVAILABLE', message);
  }
}
