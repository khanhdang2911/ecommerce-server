import express from "express";
import { signUp } from "../../controllers/access.controller";
const accessRouter = express.Router();

accessRouter.post("/access/signUp", signUp);

export default accessRouter;
