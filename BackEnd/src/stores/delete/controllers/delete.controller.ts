import { type Request, type Response, type NextFunction } from "express";
import Store from "@model/store.model";
import Product from "@model/product.model";
import cloud from "@config/cloud.config";
import Image from "@model/image.model";
import db from "@config/database.config";
import { Op } from "sequelize";
import { checkAccessUserInStoreAsOwner } from "@service/store.service";

const deleteStore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { idStore } = req.params;
  const { userId } = req.USER;
  const t = await db.transaction();
  try {
    if (!(await checkAccessUserInStoreAsOwner(userId, idStore)))
      return res.status(403).json({ success: false, error: { message: "You are not alowed to do that" } });

    await Store.destroy({ where: { idStore }, transaction: t })
      .then(async () => {
        await Product.destroy({
          where: {
            idStore,
          },
          transaction: t,
        });
      })
      .then(async () => {
        await Image.destroy({
          where: {
            idCloud: {
              [Op.like]: `%project/${idStore}%`,
            },
          },
          transaction: t,
        });
      })
      .catch(async error => {
        await t.rollback();
        throw new Error(error);
      });

    await cloud.api.delete_resources_by_prefix(`project/${idStore}`).catch(async () => {
      await t.rollback();
      throw new Error("error");
    });

    await t.commit();
  } catch (error) {
    next(error);
    return;
  }

  try {
    await cloud.api.delete_folder(`project/${idStore}`);
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    next(error);
  }
};

export default deleteStore;
