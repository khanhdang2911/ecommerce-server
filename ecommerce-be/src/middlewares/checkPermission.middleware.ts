import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../core/error.response";
import { StatusCodes } from "http-status-codes";
import { AccessControl } from "accesscontrol";
import { getRolesService } from "../services/rbac.service";
//grant list
let grantList = await getRolesService();
const ac = new AccessControl(grantList);

const checkPermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req?.shop?.roles[0];
    console.log("role", role);
    const permission = ac.can(role)?.[action]?.(resource);
    if (!permission.granted) {
      throw new ErrorResponse(StatusCodes.FORBIDDEN, "Permission denied");
    }
    next();
  };
};

export default checkPermission;
