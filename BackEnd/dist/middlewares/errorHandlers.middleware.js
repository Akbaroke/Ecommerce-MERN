"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const http_errors_1 = require("http-errors");
const logger_log_1 = __importDefault(require("../logs/logger.log"));
const notFound = (_req, _res, next) => {
    next(new http_errors_1.NotFound());
};
exports.notFound = notFound;
const errorHandler = (error, _req, res, _next) => {
    var _a, _b, _c;
    logger_log_1.default.error(error.message);
    res.status((_a = error.status) !== null && _a !== void 0 ? _a : 500).json({
        success: false,
        error: {
            message: error.message,
            _message: (_c = (_b = error.parent) === null || _b === void 0 ? void 0 : _b.sqlMessage) !== null && _c !== void 0 ? _c : undefined,
        },
    });
};
exports.errorHandler = errorHandler;
