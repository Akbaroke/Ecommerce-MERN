"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyFile_middleware_1 = __importDefault(require("../middlewares/verifyFile.middleware"));
const verifySchemas_middleware_1 = require("../middlewares/verifySchemas.middleware");
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const collaboration_controller_1 = require("./collaboration/controllers/collaboration.controller");
const create_controller_1 = __importDefault(require("./create/controllers/create.controller"));
const delete_controller_1 = __importDefault(require("./delete/controllers/delete.controller"));
const getListStore_controller_1 = __importDefault(require("./get/controllers/getListStore.controller"));
const getStore_controller_1 = __importDefault(require("./get/controllers/getStore.controller"));
const updateStore_controller_1 = __importDefault(require("./update/controllers/updateStore.controller"));
const route = (0, express_1.Router)();
route.get("/stores", verifyToken_middleware_1.verifyToken, getListStore_controller_1.default);
route.post("/store/create", verifyToken_middleware_1.verifyToken, verifyFile_middleware_1.default, (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Store.create), create_controller_1.default);
route.post("/store/add/:idStore", verifyToken_middleware_1.verifyToken, (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Store.addC), collaboration_controller_1.add);
route.put("/store/accept/:idStore", verifyToken_middleware_1.verifyToken, collaboration_controller_1.accept);
route
    .route("/store/:idStore")
    .get(verifyToken_middleware_1.verifyToken, getStore_controller_1.default)
    .put(verifyToken_middleware_1.verifyToken, verifyFile_middleware_1.default, (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Store.update), updateStore_controller_1.default)
    .delete(verifyToken_middleware_1.verifyToken, delete_controller_1.default);
exports.default = route;
