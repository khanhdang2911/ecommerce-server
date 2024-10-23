import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorResponse(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
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

export { handleNotFound, handleCommonError };
