import { AxiosError } from "axios";

export const exceptionHandler = (error, req, res, next) => {
  if (error instanceof AxiosError) {
    console.warn(`Caught Error for ${req.path}:`, error.cause);
    return res.status(error.code === 'ECONNREFUSED' ? 503 : error.response?.status || 500).json({
      message: error.message,
    });
  }

  if (error instanceof CustomError) {
    return res.status(error.status).json({
      message: error.error.message,
    });
  }
  
  res.status(500).json({
    message: 'Internal Server Error',
  });
};

export const createCustomError = (status: number, message: string) => {
  return new CustomError(status, Error(message))
}

export const routeNotFoundHandler = (_req, res) => {
    res.status(404).json({
      message: "Not Found",
    });
}

export class CustomError extends Error {
  status: number;
  error: Error;

  constructor(status: number, error: Error) {
    super()
    this.status = status
    this.error = error
  }
}