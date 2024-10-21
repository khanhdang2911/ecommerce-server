import { NextFunction, Request, Response } from "express";
import * as ApiKeyService from "../services/apiKey.service";
import * as crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";

const createApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permission = req.body.permission;
    if (!permission) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Missing required fields"
      );
    }
    const apiKey = crypto.randomBytes(64).toString("hex");
    const response = await ApiKeyService.createApiKeyService(
      apiKey,
      permission
    );
    res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};
export { createApiKey };
