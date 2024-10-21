import express from "express";
import { signUp } from "../../controllers/access.controller";
import { createApiKey } from "../../controllers/apiKey.controller";
import { asyncHandler } from "../../middlewares/handleError.middleware";
const accessRouter = express.Router();

accessRouter.post("/access/signUp", asyncHandler(signUp));
accessRouter.post("/access/createApiKey", asyncHandler(createApiKey));

export default accessRouter;
