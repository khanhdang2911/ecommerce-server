import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import { IResource, Resource } from "../models/resource.model";
import { IRole, Role } from "../models/role.model";
import {
  addRoleGrantValidation,
  deleteRoleGrantValidation,
} from "../validations/rbac.validation";

const createResourceService = async (resource: IResource) => {
  return await Resource.create(resource);
};
const createRoleService = async (role: IRole) => {
  return await Role.create(role);
};

const getRolesService = async () => {
  // role, resource, action, attributes
  const roles = await Role.aggregate([
    {
      $unwind: "$role_grants",
    },
    {
      $lookup: {
        from: "resources",
        localField: "role_grants.resource",
        foreignField: "_id",
        as: "resource",
      },
    },
    {
      $unwind: "$resource",
    },
    {
      $unwind: "$role_grants.action",
    },
    {
      $project: {
        role: "$role_name",
        resource: "$resource.src_name",
        action: "$role_grants.action",
        attributes: "$role_grants.attributes",
        _id: 0,
      },
    },
  ]);
  return roles;
};

const addRoleGrantService = async (roleGrant: any) => {
  const { resource, role, action, attributes } = roleGrant;
  const { error } = await addRoleGrantValidation(roleGrant);
  if (error) throw error;
  const roleInDB = await Role.findOne({
    role_name: role,
  });
  if (!roleInDB) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Role not found");
  }
  const roleGrants = await Role.findOne({
    role_name: role,
    "role_grants.resource": resource,
    "role_grants.action": action,
  });
  if (roleGrants) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Role grant already exists"
    );
  }
  return await Role.findOneAndUpdate(
    {
      role_name: role,
    },
    {
      $push: {
        role_grants: {
          resource: resource,
          action: action,
          attributes: attributes,
        },
      },
    },
    {
      new: true,
    }
  );
};

//just delete action from role_grants
const deleteRoleGrantService = async (roleGrant: any) => {
  const { resource, role, action } = roleGrant;
  const { error } = await deleteRoleGrantValidation(roleGrant);
  if (error) throw error;
  const roleInDB = await Role.findOne({
    role_name: role,
  });
  if (!roleInDB) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Role not found");
  }
  return await Role.findOneAndUpdate(
    {
      role_name: role,
      "role_grants.resource": resource,
    },
    {
      $pull: {
        "role_grants.$.action": action,
      },
    },
    {
      new: true,
    }
  );
};
export {
  createResourceService,
  createRoleService,
  getRolesService,
  addRoleGrantService,
  deleteRoleGrantService,
};
