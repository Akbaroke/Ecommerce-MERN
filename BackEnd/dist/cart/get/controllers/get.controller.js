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
const image_model_1 = __importDefault(require("../../../models/image.model"));
const product_model_1 = __importDefault(require("../../../models/product.model"));
const store_model_1 = __importDefault(require("../../../models/store.model"));
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idStore } = req.params;
    const { userId } = req.USER;
    try {
        yield cart_model_1.default.findAll({
            where: { userId, idStore },
            attributes: ["count", "idStore", "idProduct"],
            order: [["updatedAt", "ASC"]],
            limit: 100,
        })
            .then((values) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            for (const value of values) {
                const product = yield product_model_1.default.findOne({
                    where: {
                        idStore,
                        idProduct: value.getDataValue("idProduct"),
                    },
                    attributes: ["discount", "price"],
                    include: [{ model: store_model_1.default, as: "store", attributes: ["discount"] }],
                });
                if (product === null) {
                    yield cart_model_1.default.destroy({
                        where: {
                            idStore,
                            idProduct: value.getDataValue("idProduct"),
                            userId,
                        },
                    });
                    return;
                }
                else {
                    let price = Number(product === null || product === void 0 ? void 0 : product.getDataValue("discount")) === 0
                        ? Number(product === null || product === void 0 ? void 0 : product.getDataValue("price"))
                        : Number(product === null || product === void 0 ? void 0 : product.getDataValue("price")) -
                            Number(product === null || product === void 0 ? void 0 : product.getDataValue("price")) * (Number(product === null || product === void 0 ? void 0 : product.getDataValue("discount")) / 100);
                    price =
                        Number((_a = product.store) === null || _a === void 0 ? void 0 : _a.getDataValue("discount")) === 0
                            ? price
                            : price - price * (Number((_b = product.store) === null || _b === void 0 ? void 0 : _b.getDataValue("discount")) / 100);
                    yield cart_model_1.default.update({
                        price,
                        totalPrice: Number(value.getDataValue("count")) * Number(price),
                        updatedAt: Number(new Date().getTime()),
                    }, {
                        where: {
                            idStore,
                            idProduct: value.getDataValue("idProduct"),
                            userId,
                        },
                    });
                }
            }
        }))
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d, _e, _f;
            const cart = yield cart_model_1.default.findAndCountAll({
                where: { userId, idStore },
                attributes: ["count", "price", "totalPrice"],
                include: [
                    {
                        model: product_model_1.default,
                        as: "product",
                        attributes: ["nameProduct"],
                        include: [{ model: image_model_1.default, as: "image", attributes: ["secure_url"] }],
                    },
                    { model: store_model_1.default, as: "store", attributes: ["tax"] },
                ],
                order: [["updatedAt", "ASC"]],
                limit: 100,
            });
            let totalPrice = 0;
            let tax = 0;
            const products = [];
            for (const value of cart.rows) {
                products.push({
                    nameProduct: (_c = value.product) === null || _c === void 0 ? void 0 : _c.getDataValue("nameProduct"),
                    image: (_e = (_d = value.product) === null || _d === void 0 ? void 0 : _d.image) === null || _e === void 0 ? void 0 : _e.getDataValue("secure_url"),
                    price: value.getDataValue("price"),
                    totalPrice: value.getDataValue("totalPrice"),
                    count: value.getDataValue("count"),
                });
                totalPrice += value.getDataValue("totalPrice");
                tax += (Number((_f = value.store) === null || _f === void 0 ? void 0 : _f.getDataValue("tax")) / 100) * Number(value.getDataValue("totalPrice"));
            }
            const totalProduct = cart.count;
            res
                .status(200)
                .json({
                success: true,
                data: products,
                details: { totalProduct, totalPrice, tax, totals: tax + totalPrice },
            });
        }))
            .catch(error => {
            throw new Error(error);
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = get;
