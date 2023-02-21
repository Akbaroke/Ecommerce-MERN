import { Router } from "express";
import verifyFile from "middlewares/verifyFile.middleware";
import { schema, validateSchema } from "../middlewares/verifySchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { accept, add } from "./collaboration/controllers/collaboration.controller";
import createStore from "./create/controllers/create.controller";
import deleteStore from "./delete/controllers/delete.controller";
import getStores from "./get/controllers/getListStore.controller";
import getStore from "./get/controllers/getStore.controller";
import updateStore from "./update/controllers/updateStore.controller";

const route: Router = Router();

route.get("/stores", verifyToken, getStores);
route.post("/store/create", verifyToken, verifyFile, validateSchema(schema.Store.create), createStore);
route.post("/store/add/:idStore", verifyToken, validateSchema(schema.Store.addC), add);
route.put("/store/accept/:idStore", verifyToken, accept);
route
  .route("/store/:idStore")
  .get(verifyToken, getStore)
  .put(verifyToken, verifyFile, validateSchema(schema.Store.update), updateStore)
  .delete(verifyToken, deleteStore);

export default route;
