"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyFile_middleware_1 = __importDefault(require("../middlewares/verifyFile.middleware"));
const verifyQuery_middleware_1 = require("../middlewares/verifyQuery.middleware");
const verifySchemas_middleware_1 = require("../middlewares/verifySchemas.middleware");
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const add_controller_1 = __importDefault(require("./add/controllers/add.controller"));
const deleteProduct_controller_1 = __importDefault(require("./delete/controllers/deleteProduct.controller"));
const getCatagoryProducts_1 = __importDefault(require("./get/controllers/getCatagoryProducts"));
const getProduct_controller_1 = __importDefault(require("./get/controllers/getProduct.controller"));
const updateProduct_controller_1 = __importDefault(require("./update/controllers/updateProduct.controller"));
const route = (0, express_1.Router)();
route.post("/product/:idStore", verifyToken_middleware_1.verifyToken, verifyFile_middleware_1.default, (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Product.add), add_controller_1.default);
route.get("/products/:idStore", verifyToken_middleware_1.verifyToken, (0, verifyQuery_middleware_1.validateQuery)(verifyQuery_middleware_1.query.get), getProduct_controller_1.default);
route.get("/products/category/:idStore", verifyToken_middleware_1.verifyToken, getCatagoryProducts_1.default);
route
    .route("/product")
    .delete(verifyToken_middleware_1.verifyToken, (0, verifyQuery_middleware_1.validateQuery)(verifyQuery_middleware_1.query.isIp), deleteProduct_controller_1.default)
    .put(verifyToken_middleware_1.verifyToken, (0, verifyQuery_middleware_1.validateQuery)(verifyQuery_middleware_1.query.isIp), verifyFile_middleware_1.default, (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Product.update), updateProduct_controller_1.default);
exports.default = route;
