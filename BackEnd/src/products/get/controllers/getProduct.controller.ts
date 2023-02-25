import Image from "@model/image.model";
import Product from "@model/product.model";
import { type Request, type Response, type NextFunction } from "express";
import { Op } from "sequelize";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);
  const page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);
  const search = req.query.search === undefined || req.query.search === "" ? "" : req.query.search;
  const start = (page - 1) * limit;
  const end = page * limit;
  try {
    const products = await Product.findAndCountAll({
      where: {
        idStore: req.params.idStore,
        nameProduct: { [Op.like]: `%${search as string}%` },
      },
      attributes: [
        "idProduct",
        "nameProduct",
        "price",
        "discount",
        "stock",
        "detail",
        "category",
        "createdAt",
        "updatedAt",
      ],
      order: [["updatedAt", "DESC"]],
      include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
      limit,
      offset: start,
    });
    const count = products.count;
    const pagination = {};
    Object.assign(pagination, { totalRow: products.count, totalPage: Math.ceil(count / limit) });
    if (end < count) {
      Object.assign(pagination, { next: { page: page + 1, limit, remaining: count - (start + limit) } });
    }
    if (start > 0) {
      Object.assign(pagination, { prev: { page: page - 1, limit, ramaining: count - (count - start) } });
    }
    if (page > Math.ceil(count / limit)) {
      Object.assign(pagination, { prev: { remaining: count } });
    }
    res.status(200).json({ success: true, pagination, data: products.rows });
  } catch (error) {
    next(error);
  }
};

export default getProducts;
