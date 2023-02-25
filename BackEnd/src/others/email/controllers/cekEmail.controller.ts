import { type Request, type Response, type NextFunction } from "express";
import User from "@model/user.model";

const cekEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      attributes: ["nama"],
      where: { email },
    });
    if (user === null) return res.status(200).json({ success: true, data: { message: "email available" } });
    res.status(202).json({ success: true, data: { message: "email not available" } });
  } catch (error) {
    next(error);
  }
};

export default cekEmail;
