"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const updateUser_controller_1 = __importDefault(require("./update/controllers/updateUser.controller"));
const verifyFile_middleware_1 = __importDefault(require("../middlewares/verifyFile.middleware"));
const verifySchemas_middleware_1 = require("../middlewares/verifySchemas.middleware");
const route = (0, express_1.Router)();
route.put("/user/:userId", verifyToken_middleware_1.verifyTokenAndAuthorization, verifyFile_middleware_1.default, (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.User.update), updateUser_controller_1.default);
exports.default = route;
