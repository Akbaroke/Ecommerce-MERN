"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_config_1 = __importDefault(require("../configs/multer.config"));
const verifyFile = (req, res, next) => {
    multer_config_1.default.single("image")(req, res, error => {
        if (error !== undefined && error.field === "image") {
            next(error);
            return;
        }
        if (req.file === undefined) {
            next();
            return;
        }
        req.body.image = req.file;
        next();
    });
};
exports.default = verifyFile;
