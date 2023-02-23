import { Router } from "express";
import { verifyTokenAndAuthorization } from "middlewares/verifyToken.middleware";
import updateUser from "./update/controllers/updateUser.controller";
import verifyFile from "../middlewares/verifyFile.middleware";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
const route: Router = Router();

route.put("/user/:userId", verifyTokenAndAuthorization, verifyFile, validateSchema(schema.User.update), updateUser);

export default route;
