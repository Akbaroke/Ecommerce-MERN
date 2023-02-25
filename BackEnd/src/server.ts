import express, { type Application } from "express";
import morgan from "morgan";
import cors from "cors";
import logger from "./logs/logger.log";
import { errorHandler, notFound } from "./middlewares/errorHandlers.middleware";
import "dotenv/config";
import db from "./configs/database.config";
import cookieParser from "cookie-parser";
import routeAuth from "./auth/index";
import routeStore from "./stores/index";
import routeProduct from "./products/index";
import routeCart from "./cart/index";
import routeUser from "./user/index";
import route from "./others/index";
import cekOtp from "./services/otp.service";
import cekUser from "./services/user.service";

db.sync({ alter: true, force: false })
  .then(() => {
    logger.info("Connection to database successfully");
  })
  .catch(error => {
    console.log(error);
    logger.error("Connection to database failed");
    process.exit(1);
  });

const app: Application = express();

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

cekOtp;
cekUser;

app.use("/api/auth", routeAuth);
app.use("/api", routeStore);
app.use("/api", routeProduct);
app.use("/api", routeCart);
app.use("/api", routeUser);
app.use("/api", route);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT as string, () => {
  logger.info(`Listen at port ${process.env.PORT as string} (${process.env.NODE_ENV as string})`);
});
