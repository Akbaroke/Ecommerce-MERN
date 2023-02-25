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
const otp_model_1 = __importDefault(require("../../../models/otp.model"));
const token_model_1 = __importDefault(require("../../../models/token.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const generateToken_util_1 = require("../../../utils/generateToken.util");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        yield user_model_1.default.findOne({
            attributes: ["id", "nama", "email", "password", "status", "role", "tokenId", "expiredAt"],
            where: {
                email,
            },
        }).then((values) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (values === null)
                return res.status(400).json({ success: false, error: { message: "user not found" } });
            if (values.status !== "active") {
                if (Number(values.getDataValue("expiredAt")) < Number(new Date().getTime())) {
                    yield user_model_1.default.destroy({
                        where: { email },
                    });
                    yield otp_model_1.default.destroy({ where: { email } });
                    return res.status(410).json({
                        success: false,
                        error: { message: "Expired account please register again" },
                    });
                }
                return res.status(403).json({
                    success: false,
                    error: { message: "the account has not been verified" },
                });
            }
            const valid = yield ((_a = values.comparePassword) === null || _a === void 0 ? void 0 : _a.call(values, password));
            if (valid === false)
                return res.status(401).json({ success: false, error: { message: "password invalid" } });
            const { accessToken, refreshToken } = yield (0, generateToken_util_1.generateToken)(values.getDataValue("id"), values.getDataValue("email"), values.getDataValue("nama"), values.getDataValue("role"));
            if (values.tokenId === null || values.tokenId === undefined) {
                const createToken = yield token_model_1.default.create({ accessToken, refreshToken });
                values.setDataValue("tokenId", createToken.getDataValue("tokenId"));
                yield values.save();
            }
            const user = yield user_model_1.default.findOne({
                where: { email },
                attributes: ["nama", "email"],
                include: [{ model: token_model_1.default, as: "token", attributes: ["accessToken"] }],
                raw: true,
            });
            res.status(200).json({
                success: true,
                message: "Login successfully",
                data: user,
            });
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.default = login;
