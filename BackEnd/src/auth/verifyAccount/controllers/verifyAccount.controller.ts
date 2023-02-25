import Otp from "@model/otp.model";
import { type Request, type Response, type NextFunction } from "express";
import User from "@model/user.model";
import { type STATUS } from "@tp/default";
import { sendEmailAfterVerification } from "@util/sendEmail.util";

const verifyAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { otp } = req.body;
  try {
    const findOtpInTable = await Otp.findOne({
      where: { otp, type: "register" },
    });
    if (findOtpInTable === null) return res.status(400).json({ success: false, error: { message: "otp invalid" } });

    if (Number(findOtpInTable.getDataValue("expiredAt")) < Number(new Date().getTime())) {
      await Otp.destroy({
        where: {
          otp,
          type: "register",
        },
      });
      return res.status(400).json({ success: false, error: { message: "otp expired" } });
    }

    const user = await User.findOne({
      attributes: ["expiredAt", "status", "nama"],
      where: { email: findOtpInTable.getDataValue("email") },
    });
    if (
      user == null ||
      user.getDataValue("expiredAt") === null ||
      user.getDataValue("status") === ("active" as unknown as STATUS)
    ) {
      await Otp.destroy({
        where: {
          otp,
          type: "register",
        },
      });
      return res.status(200).json({ success: false, error: { message: "user not found" } });
    }

    if (Number(user.getDataValue("expiredAt")) < Number(new Date().getTime())) {
      await User.destroy({
        where: { email: findOtpInTable.getDataValue("email") },
      });
      await Otp.destroy({
        where: {
          otp,
          type: "register",
        },
      });
      return res.status(400).json({ success: false, error: { message: "account expired" } });
    }

    await User.update(
      { status: "active" as unknown as STATUS, expiredAt: null },
      { where: { email: findOtpInTable.getDataValue("email") } }
    );

    await sendEmailAfterVerification(findOtpInTable.getDataValue("email"), user.getDataValue("nama"));

    await Otp.destroy({
      where: {
        otp,
        type: "register",
      },
    });

    res.status(200).json({
      success: true,
      data: {
        message: "verification account successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};

export default verifyAccount;
