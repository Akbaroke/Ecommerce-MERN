import { type Request, type Response, type NextFunction } from "express";
import Cart from "@model/cart.model";
import Image from "@model/image.model";
import Product from "@model/product.model";
import Store from "@model/store.model";

const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);
  const page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);
  const start = (page - 1) * limit;
  const end = page * limit;
  const { idStore } = req.params;
  const { userId } = req.USER;
  try {
    await Cart.findAll({
      where: { userId, idStore },
      attributes: ["count", "idStore", "idProduct"],
      order: [["updatedAt", "ASC"]],
      limit,
      offset: start,
    })
      .then(async values => {
        for (const value of values) {
          const product = await Product.findOne({
            where: {
              idStore,
              idProduct: value.getDataValue("idProduct"),
            },
            attributes: ["discount", "price"],
            include: [{ model: Store, as: "store", attributes: ["discount"] }],
          });
          if (product === null) {
            await Cart.destroy({
              where: {
                idStore,
                idProduct: value.getDataValue("idProduct"),
                userId,
              },
            });
            return;
          } else {
            let price =
              Number(product?.getDataValue("discount")) === 0
                ? Number(product?.getDataValue("price"))
                : Number(product?.getDataValue("price")) -
                  Number(product?.getDataValue("price")) * (Number(product?.getDataValue("discount")) / 100);

            price =
              Number(product.store?.getDataValue("discount")) === 0
                ? price
                : price - price * (Number(product.store?.getDataValue("discount")) / 100);

            await Cart.update(
              {
                price,
                totalPrice: Number(value.getDataValue("count")) * Number(price),
                updatedAt: Number(new Date().getTime()),
              },
              {
                where: {
                  idStore,
                  idProduct: value.getDataValue("idProduct"),
                  userId,
                },
              }
            );
          }
        }
        return values;
      })
      .then(async () => {
        const cart = await Cart.findAndCountAll({
          where: { userId, idStore },
          attributes: ["count", "price", "totalPrice"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["nameProduct"],
              include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
            },
          ],
          order: [["updatedAt", "ASC"]],
          limit,
          offset: start,
        });
        const count = cart.count;
        const pagination = {};
        Object.assign(pagination, { totalRow: cart.count, totalPage: Math.ceil(count / limit) });
        if (end < count) {
          Object.assign(pagination, { next: { page: page + 1, limit, remaining: count - (start + limit) } });
        }
        if (start > 0) {
          Object.assign(pagination, { prev: { page: page - 1, limit, remaining: count - (count - start) } });
        }
        if (page > Math.ceil(count / limit)) {
          Object.assign(pagination, { prev: { remaining: count } });
        }
        return res.status(200).json({ success: true, pagination, data: cart });
      })
      .catch(error => {
        throw new Error(error);
      });
  } catch (error) {
    next(error);
  }
};

export default get;
