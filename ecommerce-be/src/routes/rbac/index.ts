import express from "express";
import * as rbacController from "../../controllers/rbac.controller";
import asyncHandler from "../../helpers/asyncHandler";
const rbacRouter = express.Router();

rbacRouter.post("/create-role", asyncHandler(rbacController.createRole));
rbacRouter.get("/get-roles", asyncHandler(rbacController.getRoles));
rbacRouter.post("/create-resource", asyncHandler(rbacController.createResource));
// add role grant for resource and action with attributes in role
rbacRouter.post("/add-role-grant", asyncHandler(rbacController.addRoleGrant));
rbacRouter.delete("/delete-role-grant", asyncHandler(rbacController.deleteRoleGrant));
export default rbacRouter;
