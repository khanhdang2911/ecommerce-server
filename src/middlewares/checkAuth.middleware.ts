import { Request, Response, NextFunction } from "express";
import * as ApiKeyService from "../services/apiKey.service";
const HEADER = {
  apiKey: "x-api-key",
  authorization: "Authorization",
};

declare module "express-serve-static-core" {
  interface Request {
    objKey?: any;
  }
}
const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.apiKey]?.toString();
    if (!key) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    //check key in database
    const objKey = await ApiKeyService.findByIdService(key as string);
    if (!objKey) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    req.objKey = objKey;
    next();
  } catch (error) {}
};

const permission = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions.includes(role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    console.log("permission", req.objKey.permissions, role);
    next();
  };
};
export { checkApiKey, permission };
