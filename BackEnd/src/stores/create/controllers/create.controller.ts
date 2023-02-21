import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Store from "@model/store.model";
import Image from "@model/image.model";
import { RSTORE } from "@tp/default";
import generateId from "@util/generateOtp.util";
import cloud from "@config/cloud.config";
import hashids from "hashids";

const createStore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { nameStore, image } = req.body;
  const { userId } = req.USER;
  const hash = new hashids(process.env.SALTHASHIDS as string, 16);
  try {
    const store = await Store.count({
      where: {
        access: {
          [Op.like]: `%${userId}%`,
        },
      },
    });

    if (store === 3) return res.status(400).json({ success: false, error: { message: "maximum 3" } });

    let id: string = await generateId(4);
    let valid = true;
    while (valid) {
      const checkId = await Store.findOne({
        where: {
          idStore: hash.encode(id),
        },
      });
      if (!checkId) {
        valid = false;
      } else {
        id = await generateId(4);
      }
    }

    const idStore = hash.encode(id);
    const { secure_url, public_id } = await cloud.uploader.upload(image?.path as string, {
      folder: `project/${idStore}`,
    });
    await Image.create({
      idCloud: public_id,
      secure_url: secure_url,
    })
      .then(async (x: any) => {
        await Store.create({
          idStore,
          nameStore,
          idImage: x.getDataValue("idImage") as string,
          access: JSON.stringify([{ userId, role: "owner" as unknown as RSTORE }]),
        });
      })
      .catch(async error => {
        await cloud.uploader.destroy(public_id);
        throw new Error(error);
      });

    res.status(200).json({
      success: true,
      data: { message: "create store successfully" },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default createStore;
