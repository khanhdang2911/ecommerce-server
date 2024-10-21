import { Request, Response } from "express";
import * as AccessService from "../services/access.service";
import ErrorResponse from "../core/error.response";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import SuccessResponse from "../core/success.response";

const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const newShop = await AccessService.createShopService(name, email, password);
  //return response
  new SuccessResponse(StatusCodes.CREATED, ReasonPhrases.CREATED, newShop).send(
    res
  );
  return;
};

export { signUp };
