import { Router } from "express";
import { query, validateQuery } from "middlewares/verifyQuery.middleware";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
import { verifyToken } from "middlewares/verifyToken.middleware";
import add from "./add/controllers/add.controller";
import deleteCart from "./delete/controllers/delete.controller";
import get from "./get/controllers/get.controller";
import update from "./update/controllers/update.controller";

const route: Router = Router();

route.get("/cart/:idStore", verifyToken, get);
route
  .route("/cart")
  .post(verifyToken, validateQuery(query.isIp), validateSchema(schema.Cart.add), add)
  .put(verifyToken, validateQuery(query.isIp), validateSchema(schema.Cart.update), update)
  .delete(verifyToken, validateQuery(query.isIp), deleteCart);

export default route;
