import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(ReasonPhrases.NOT_FOUND);
  res.statusCode = StatusCodes.NOT_FOUND;
  next(error);
};

const handleCommonError = (
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMessage = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: errorMessage,
  });
};

const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next);
  };
};
export { handleNotFound, handleCommonError, asyncHandler };
