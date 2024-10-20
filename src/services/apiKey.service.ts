import { ApiKey } from "../models/apiKey.model";
const createApiKeyService = async (apiKey: string, permission: string) => {
  try {
    const newApiKey = await ApiKey.create({
      key: apiKey,
      permissions: [permission],
    });
    if (apiKey) {
      return {
        success: true,
        message: "Api Key created successfully",
        data: newApiKey,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};
const findByIdService = async (key: string) => {
  try {
    const apiKeyInDb = await ApiKey.findOne({ key: key }).lean();
    return apiKeyInDb;
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

export { findByIdService, createApiKeyService };
