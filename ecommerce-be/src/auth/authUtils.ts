import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const createPairToken = (
  payload: object,
  privateKey: string,
  publicKey: string
) => {
  const accessToken = JWT.sign(payload, publicKey, {
    expiresIn: process.env.EXPRIED_ACCESS_TOKEN_TIME,
  });
  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: process.env.EXPRIED_REFRESH_TOKEN_TIME,
  });
  return { accessToken, refreshToken };
};

export { createPairToken };
