import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import mongoInstance from "./dbs/init.mongodb";
import router from "./routes";
import {
  handleCommonError,
  handleNotFound,
} from "./middlewares/handleError.middleware";

const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init routes
app.use("/", router);
//init db
mongoInstance;
//handle error
app.use(handleNotFound);
app.use(handleCommonError);

export default app;
