import { type Request, type Response, type NextFunction } from "express";
import Cart from "@model/cart.model";
import Image from "@model/image.model";
import Product from "@model/product.model";
import Store from "@model/store.model";

const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { idStore } = req.params;
  const { userId } = req.USER;
  try {
    await Cart.findAll({
      where: { userId, idStore },
      attributes: ["count", "idStore", "idProduct"],
      order: [["updatedAt", "ASC"]],
      limit: 100,
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
            { model: Store, as: "store", attributes: ["tax"] },
          ],
          order: [["updatedAt", "ASC"]],
          limit: 100,
        });
        let totalPrice = 0;
        let tax = 0;
        const products: any[] = [];
        for (const value of cart.rows) {
          products.push({
            nameProduct: value.product?.getDataValue("nameProduct"),
            image: value.product?.image?.getDataValue("secure_url"),
            price: value.getDataValue("price"),
            totalPrice: value.getDataValue("totalPrice"),
            count: value.getDataValue("count"),
          });
          totalPrice += value.getDataValue("totalPrice");
          tax += (Number(value.store?.getDataValue("tax")) / 100) * Number(value.getDataValue("totalPrice"));
        }

        const totalProduct = cart.count;
        res
          .status(200)
          .json({
            success: true,
            data: products,
            details: { totalProduct, totalPrice, tax, totals: tax + totalPrice },
          });
      })
      .catch(error => {
        throw new Error(error);
      });
  } catch (error) {
    next(error);
  }
};

export default get;
