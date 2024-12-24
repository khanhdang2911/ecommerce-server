import { Request, Response } from "express";
import SuccessResponse from "../core/success.response";
import { StatusCodes } from "http-status-codes";
import * as rbacService from "../services/rbac.service";
const createResource = async (req: Request, res: Response) => {
  const resource = req.body;
  const newResource = await rbacService.createResourceService(resource);
  new SuccessResponse(
    StatusCodes.CREATED,
    "Create resource successfully!",
    newResource
  ).send(res);
};
const createRole = async (req: Request, res: Response) => {
  const role = req.body;
  const newRole = await rbacService.createRoleService(role);
  new SuccessResponse(
    StatusCodes.CREATED,
    "Create role successfully!",
    newRole
  ).send(res);
};

const getRoles = async (req: Request, res: Response) => {
  const roles = await rbacService.getRolesService();
  new SuccessResponse(StatusCodes.OK, "Get roles successfully!", roles).send(
    res
  );
};

const addRoleGrant = async (req: Request, res: Response) => {
  const roleGrant = req.body;
  const newRoleGrant = await rbacService.addRoleGrantService(roleGrant);
  new SuccessResponse(
    StatusCodes.CREATED,
    "Add role grant successfully!",
    newRoleGrant!
  ).send(res);
};

const deleteRoleGrant = async (req: Request, res: Response) => {
  const roleGrant = req.body;
  const newRoleGrant = await rbacService.deleteRoleGrantService(roleGrant);
  new SuccessResponse(
    StatusCodes.CREATED,
    "Delete role grant successfully!",
    newRoleGrant!
  ).send(res);
};
export { createResource, createRole, getRoles, addRoleGrant, deleteRoleGrant };
