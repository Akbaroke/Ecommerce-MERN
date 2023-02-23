import { Request, Response, NextFunction } from "express";
import User from "@model/user.model";
import Image from "@model/image.model";

const getUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId } = req.USER;
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      attributes: ["id", "nama", "email", "status", "role"],
      include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
    });
    if (!user) return res.status(404).json({ success: false, error: { message: "user not found" } });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export default getUser;
