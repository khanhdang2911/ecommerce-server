import { ApiKey } from "../models/apiKey.model";
const createApiKeyService = async (apiKey: string, permission: string) => {
  const newApiKey = await ApiKey.create({
    key: apiKey,
    permissions: [permission],
  });
  return newApiKey;
};
const findByIdService = async (key: string) => {
  const apiKeyInDb = await ApiKey.findOne({ key: key }).lean();
  return apiKeyInDb;
};

export { findByIdService, createApiKeyService };
