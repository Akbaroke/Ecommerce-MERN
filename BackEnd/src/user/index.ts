import { Router } from "express";
import { verifyToken, verifyTokenAdmin, verifyTokenAndAuthorization } from "middlewares/verifyToken.middleware";
import updateUser from "./update/controllers/updateUser.controller";
import verifyFile from "../middlewares/verifyFile.middleware";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
import { query, validateQuery } from "middlewares/verifyQuery.middleware";
import getUsers from "./get/controllers/getUsers.controller";
import getUser from "./get/controllers/getUser.controller";
const route: Router = Router();

route.put("/user/:userId", verifyTokenAndAuthorization, verifyFile, validateSchema(schema.User.update), updateUser);
route.get("/users", verifyTokenAdmin, validateQuery(query.get), getUsers);
route.get("/user", verifyToken, getUser);

export default route;
