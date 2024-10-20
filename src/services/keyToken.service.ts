import { Schema } from "mongoose";
import { KeyToken } from "../models/keyToken.model";
class KeyTokenService {
  public static async createKeyToken(
    user: Schema.Types.ObjectId,
    privateKey: string,
    publicKey: string,
    refreshToken: string
  ) {
    try {
      const newKeyToken = await KeyToken.create({
        user,
        privateKey,
        publicKey,
        refreshToken,
      });
      if (newKeyToken) {
        return {
          success: true,
          message: "KeyToken created successfully",
          data: newKeyToken,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
}

export default KeyTokenService;
