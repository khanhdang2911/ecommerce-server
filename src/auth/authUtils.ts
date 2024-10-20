import JWT from "jsonwebtoken";

const createPairToken = (
  payload: object,
  privateKey: string,
  publicKey: string
) => {
  const accessToken = JWT.sign(payload, publicKey, {
    expiresIn: "1d",
  });
  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export { createPairToken };
