import { NextFunction, Request, Response } from "express";
import * as ApiKeyService from "../services/apiKey.service";
import * as crypto from "crypto";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import SuccessResponse from "../core/success.response";

const createApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const permission = req.body.permission;
  if (!permission) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const apiKey = crypto.randomBytes(64).toString("hex");
  const newApiKey = await ApiKeyService.createApiKeyService(apiKey, permission);
  //return response success
  new SuccessResponse(
    StatusCodes.CREATED,
    ReasonPhrases.CREATED,
    newApiKey
  ).send(res);
};
export { createApiKey };
