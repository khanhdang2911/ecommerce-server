import { Request, Response } from "express";
import * as ApiKeyService from "../services/apiKey.service";
import * as crypto from "crypto";

const createApiKey = async (req: Request, res: Response) => {
  try {
    const permission = req.body.permission;
    const apiKey = crypto.randomBytes(64).toString("hex");
    const response = await ApiKeyService.createApiKeyService(
      apiKey,
      permission
    );
    res.status(201).json(response);
  } catch (error) {}
};
export { createApiKey };
