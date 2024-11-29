import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import mongoInstance from "./dbs/init.mongodb";
import router from "./routes";
import {
  handleCommonError,
  handleNotFound,
} from "./middlewares/handleError.middleware";
import { purchaseProduct } from "./test/product.test";
import { updateInventory } from "./test/inventory.test";
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
//test redis
// await initRedis();
//test pubsub
purchaseProduct("product:001", 10);
updateInventory();
app.use(handleNotFound);
app.use(handleCommonError);

export default app;
