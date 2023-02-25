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
const cart_model_1 = __importDefault(require("../../../models/cart.model"));
const product_model_1 = __importDefault(require("../../../models/product.model"));
const sequelize_1 = require("sequelize");
const store_model_1 = __importDefault(require("../../../models/store.model"));
const image_model_1 = __importDefault(require("../../../models/image.model"));
const add = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { is, ip } = req.query;
    const { userId } = req.USER;
    const { count = 1 } = req.body;
    try {
        if ((yield cart_model_1.default.count({ where: { userId, idStore: is } })) > 100)
            return res.status(400).json({ success: false, error: { message: "error" } });
        const product = yield product_model_1.default.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        idStore: is,
                        idProduct: ip,
                    },
                    {
                        stock: {
                            [sequelize_1.Op.gt]: 0,
                        },
                    },
                ],
            },
            attributes: ["stock", "discount", "price"],
            include: [{ model: store_model_1.default, as: "store", attributes: ["discount"] }],
        });
        if (product == null)
            return res.status(404).json({ success: false, error: { message: "Product not found" } });
        if (count > product.getDataValue("stock"))
            return res
                .status(400)
                .json({ success: false, error: { message: `remaining stock ${product.getDataValue("stock")}` } });
        let price = product.getDataValue("discount") !== 0
            ? Number(product.getDataValue("price")) * (Number(product.getDataValue("discount")) / 100)
            : product.getDataValue("price");
        price =
            ((_a = product.store) === null || _a === void 0 ? void 0 : _a.getDataValue("discount")) === 0
                ? price
                : Number(price) - Number(price) * (Number((_b = product.store) === null || _b === void 0 ? void 0 : _b.getDataValue("discount")) / 100);
        yield cart_model_1.default.findOne({
            where: {
                userId,
                idStore: is,
                idProduct: ip,
            },
        })
            .then((value) => __awaiter(void 0, void 0, void 0, function* () {
            let data;
            if (value === null) {
                data = yield cart_model_1.default.create({
                    userId,
                    idProduct: ip,
                    idStore: is,
                    count,
                    price,
                    totalPrice: Number(price) * count,
                });
            }
            else {
                if (value.getDataValue("count") > product.getDataValue("stock") ||
                    value.getDataValue("count") + Number(count) > product.getDataValue("stock")) {
                    const error = new Error(`remaining stock ${product.getDataValue("stock")}`);
                    Object.assign(error, { status: 400 });
                    throw error;
                }
                data = yield value.update({
                    count: value.getDataValue("count") + Number(count),
                    totalPrice: (value.getDataValue("count") + Number(count)) * Number(price),
                });
            }
            return data;
        }))
            .then((value) => __awaiter(void 0, void 0, void 0, function* () {
            const cart = yield cart_model_1.default.findOne({
                where: { idCart: value === null || value === void 0 ? void 0 : value.getDataValue("idCart") },
                attributes: ["count", "price", "totalPrice"],
                include: [
                    {
                        model: product_model_1.default,
                        as: "product",
                        attributes: ["nameProduct"],
                        include: [{ model: image_model_1.default, as: "image", attributes: ["secure_url"] }],
                    },
                ],
            });
            return res.status(200).json({ success: true, data: { cart } });
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.default = add;
