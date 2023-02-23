import { Request, Response, NextFunction } from "express";
import User from "@model/user.model";
import Image from "@model/image.model";
import cloud from "@config/cloud.config";

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { nama, oldPassword, newPassword, image } = req.body;
  try {
    await User.findOne({
      where: { id: userId },
      attributes: ["id", "idImage", "password"],
      include: [{ model: Image, as: "image", attributes: ["idCloud"] }],
    }).then(async (value): Promise<any> => {
      let result = {
        idImage: value?.getDataValue("idImage"),
      };
      if (image !== undefined) {
        if (value?.getDataValue("idImage") === null || !value?.getDataValue("idImage")) {
          const { secure_url, public_id } = await cloud.uploader.upload(image?.path as string, {
            folder: `profile/${userId}`,
          });
          await Image.create({
            idCloud: public_id as string,
            secure_url,
          }).then(image => Object.assign(result, { idImage: image?.getDataValue("idImage") }));
        } else {
          const { secure_url, public_id } = await cloud.uploader.upload(image?.path as string, {
            public_id: value?.image.idCloud as string,
          });
          await Image.update(
            {
              idCloud: public_id,
              secure_url,
            },
            { where: { idImage: value.getDataValue("idImage") as string } }
          );
        }
      }
      if (oldPassword !== undefined || newPassword !== undefined) {
        if (!(await value?.comparePassword?.(oldPassword))) {
          return res.status(401).json({ success: false, error: { message: "password invalid" } });
        }
        await value?.update({
          nama,
          password: newPassword,
          idImage: result.idImage,
        });
      } else {
        await User.update(
          {
            nama,
            idImage: result.idImage,
          },
          { where: { id: userId } }
        );
      }
      res.status(200).json({ success: true, data: { message: "success" } });
    });
  } catch (error) {
    next(error);
  }
};

export default updateUser;
