import { Request, Response, NextFunction } from "express";
import * as ApiKeyService from "../services/apiKey.service";
import ErrorResponse from "../core/error.response";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import HEADER from "../constants/header";

// declare module "express-serve-static-core" {
//   interface Request {
//     objKey: any;
//   }
// }
const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers[HEADER.apiKey]?.toString();
  if (!key) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  //check key in database
  const objKey = await ApiKeyService.findByIdService(key as string);
  if (!objKey) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  req.objKey = objKey;
  next();
};

const permission = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey?.permissions.includes(role)) {
      throw new ErrorResponse(StatusCodes.FORBIDDEN, "Permission denied");
    }
    next();
  };
};
export { checkApiKey, permission };
