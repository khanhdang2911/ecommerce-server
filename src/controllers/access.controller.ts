import { Request, Response } from "express";
import AccessService from "../services/access.service";
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }

    const newShop = await AccessService.createShopService(
      name,
      email,
      password
    );
    res.status(201).json(newShop);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
