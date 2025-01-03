import { AxiosError } from "axios";
import { NextFunction, Request as ExRequest, Response as ExResponse } from "express";

export const exceptionHandler = (
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void => {
    if (err instanceof AxiosError) {
      console.warn(`Caught Error for ${req.path}:`, err.cause);
      return res.status(err.status!).json({
        message: err.message,
      });
    }
    if (err instanceof CustomError) {
      return res.status(err.status).json({
        message: err.error.message
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }

    next();
}

export const customError = (status: number, message: string) => {
  const customErr = new CustomError(status, Error(message))
  throw customErr
}

export const notFoundHandler = (_req, res: ExResponse) => {
    res.status(404).send({
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