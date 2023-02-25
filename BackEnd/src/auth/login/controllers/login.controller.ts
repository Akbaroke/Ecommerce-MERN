import { type Request, type Response, type NextFunction } from "express";
import Otp from "@model/otp.model";
import Token from "@model/token.model";
import User from "@model/user.model";
import { type STATUS } from "@tp/default";
import { generateToken } from "@util/generateToken.util";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    await User.findOne({
      attributes: ["id", "nama", "email", "password", "status", "role", "tokenId", "expiredAt"],
      where: {
        email,
      },
    }).then(async (value): Promise<any> => {
      if (value === null) return res.status(400).json({ success: false, error: { message: "user not found" } });

      if (value.status !== ("active" as unknown as STATUS)) {
        if (Number(value.getDataValue("expiredAt")) < Number(new Date().getTime())) {
          await User.destroy({
            where: { email },
          });
          await Otp.destroy({ where: { email } });
          return res.status(410).json({
            success: false,
            error: { message: "Expired account please register again" },
          });
        }
        return res.status(403).json({
          success: false,
          error: { message: "the account has not been verified" },
        });
      }
      const valid = await value.comparePassword?.(password as string);
      if (valid === false) return res.status(401).json({ success: false, error: { message: "password invalid" } });

      const { accessToken, refreshToken } = await generateToken({
        userId: value.getDataValue("id"),
        email: value.getDataValue("email"),
        nama: value.getDataValue("nama"),
        role: value.getDataValue("role") as unknown as string,
      });
      if (value.tokenId === null || value.tokenId === undefined) {
        const createToken = await Token.create({ accessToken, refreshToken });
        value.setDataValue("tokenId", createToken.getDataValue("tokenId"));
        await value.save();
      }
      const user = await User.findOne({
        where: { email },
        attributes: ["nama", "email"],
        include: [{ model: Token, as: "token", attributes: ["accessToken"] }],
        raw: true,
      });
      res.status(200).json({
        success: true,
        message: "Login successfully",
        data: user,
      });
    });
  } catch (error) {
    next(error);
  }
};

export default login;
