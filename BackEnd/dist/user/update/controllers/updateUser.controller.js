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
const cloud_config_1 = __importDefault(require("../../../configs/cloud.config"));
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { nama, oldPassword, newPassword, image } = req.body;
    try {
        yield user_model_1.default.findOne({
            where: { id: userId },
            attributes: ["id", "idImage", "password"],
            include: [{ model: image_model_1.default, as: "image", attributes: ["idCloud"] }],
        })
            .then((value) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let result = {
                idImage: value === null || value === void 0 ? void 0 : value.getDataValue("idImage"),
            };
            if (image !== undefined) {
                if ((value === null || value === void 0 ? void 0 : value.getDataValue("idImage")) === null || !(value === null || value === void 0 ? void 0 : value.getDataValue("idImage"))) {
                    const { secure_url, public_id } = yield cloud_config_1.default.uploader.upload(image === null || image === void 0 ? void 0 : image.path, {
                        folder: `profile/${userId}`,
                    });
                    yield image_model_1.default.create({
                        idCloud: public_id,
                        secure_url,
                    })
                        .then(image => Object.assign(result, { idImage: image === null || image === void 0 ? void 0 : image.getDataValue("idImage") }))
                        .catch(error => {
                        throw new Error(error);
                    });
                }
                else {
                    const { secure_url, public_id } = yield cloud_config_1.default.uploader.upload(image === null || image === void 0 ? void 0 : image.path, {
                        public_id: value === null || value === void 0 ? void 0 : value.image.idCloud,
                    });
                    yield image_model_1.default.update({
                        idCloud: public_id,
                        secure_url,
                    }, { where: { idImage: value.getDataValue("idImage") } });
                }
            }
            if (oldPassword !== undefined || newPassword !== undefined) {
                if (!(yield ((_a = value === null || value === void 0 ? void 0 : value.comparePassword) === null || _a === void 0 ? void 0 : _a.call(value, oldPassword)))) {
                    return res.status(401).json({ success: false, error: { message: "password invalid" } });
                }
                yield (value === null || value === void 0 ? void 0 : value.update({
                    nama,
                    password: newPassword,
                    idImage: result.idImage,
                }));
            }
            else {
                yield user_model_1.default.update({
                    nama,
                    idImage: result.idImage,
                }, { where: { id: userId } });
            }
            res.status(200).json({ success: true, data: { message: "success" } });
        }))
            .catch(error => {
            throw new Error(error);
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = updateUser;
