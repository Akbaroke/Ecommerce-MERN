import { type Request, type Response, type NextFunction } from "express";
import Otp from "@model/otp.model";
import User from "@model/user.model";
import { type TYPE } from "@tp/default";

const checkLimitBeforeTakeTheOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { ip, email, type } = req.body;
  try {
    const findOtp = await Otp.findOne({
      where: { ip, email, type: type as unknown as TYPE },
    });
    const user = await User.findOne({
      attributes: ["nama", "expiredAt"],
      where: { email },
    });
    if (user == null || (findOtp == null && user.getDataValue("expiredAt") === null))
      return res.status(400).json({ success: false, error: { message: "user not found" } });

    if (findOtp == null) {
      return res.status(200).json({
        success: false,
        data: {
          time: 0,
          message: "just take it bro",
        },
      });
    }
    if (Number(new Date().getTime()) - Number(findOtp?.getDataValue("updatedAt")) < 60000) {
      throw new Error("wait a minute");
    }

    res.status(200).json({
      success: true,
      data: { time: findOtp?.getDataValue("updatedAt"), message: ">1" },
    });
  } catch (error) {
    next(error);
  }
};

export default checkLimitBeforeTakeTheOtp;
