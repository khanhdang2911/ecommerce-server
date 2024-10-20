import express from "express";
import { signUp } from "../../controllers/access.controller";
import { createApiKey } from "../../controllers/apiKey.controller";
const accessRouter = express.Router();


accessRouter.post("/access/signUp", signUp);
accessRouter.post("/access/createApiKey", createApiKey);

export default accessRouter;
