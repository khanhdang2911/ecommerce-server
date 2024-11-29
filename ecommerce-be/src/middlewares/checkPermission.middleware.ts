import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../core/error.response";
import { StatusCodes } from "http-status-codes";

const checkPermission = (permission: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.shop?.roles;
    if (!permission.some((role) => userRole?.includes(role))) {
      throw new ErrorResponse(StatusCodes.FORBIDDEN, "Access denied");
    }
    next();
  };
};

export default checkPermission;
