import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import mongoInstance from "./dbs/init.mongodb";
import router from "./routes";
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
export default app;
