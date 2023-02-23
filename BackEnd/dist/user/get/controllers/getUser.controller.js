"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../../models/user.model"));
const image_model_1 = __importDefault(require("../../../models/image.model"));
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.USER;
    try {
        const user = yield user_model_1.default.findOne({
            where: {
                id: userId,
            },
            attributes: ["id", "nama", "email", "status", "role"],
            include: [{ model: image_model_1.default, as: "image", attributes: ["secure_url"] }],
        });
        if (!user)
            return res.status(404).json({ success: false, error: { message: "user not found" } });
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
});
exports.default = getUser;
