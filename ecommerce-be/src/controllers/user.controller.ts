import { Request, Response } from "express";
import SuccessResponse from "../core/success.response";
import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user.service";

const getUserInfo = async (req: Request, res: Response) => {
  const user = req?.shop;
  delete user.password;
  new SuccessResponse(StatusCodes.OK, "Get user info successfully", user).send(
    res
  );
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsersService();
  new SuccessResponse(StatusCodes.OK, "Get all users successfully", users).send(
    res
  );
};
export { getUserInfo, getAllUsers };
