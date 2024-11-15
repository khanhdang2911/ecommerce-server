

import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
const inventoryRouter = express.Router();

//===================================No Authentications===================================//

//===================================Authentications===================================//
inventoryRouter.use(asyncHandler(auth));

export default inventoryRouter;
