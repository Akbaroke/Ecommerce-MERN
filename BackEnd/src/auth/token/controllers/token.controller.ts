import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import Token from "@model/token.model";
import User from "@model/user.model";
import { generateAccessToken, generateToken } from "@util/generateToken.util";

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token } = req.USER;
    const findToken = await Token.findOne({ where: { accessToken: token } });
    jwt.verify(
      findToken?.getDataValue("refreshToken") as string,
      process.env.REFRESHTOKENSECRET as string,
      async (error, _decoded): Promise<any> => {
        const user = await User.findOne({
          attributes: ["id", "email", "nama", "role", "tokenId"],
          where: { tokenId: findToken?.getDataValue("tokenId") },
        });
        if (user == null) return res.status(400).json({ success: false, error: { message: "user not found" } });
        const token: any = {};
        const data = {
          userId: user.getDataValue("id"),
          email: user.getDataValue("email"),
          nama: user.getDataValue("nama"),
          role: user.getDataValue("role") as unknown as string,
        };
        if (error != null) {
          const { accessToken, refreshToken } = await generateToken(data);
          Object.assign(token, { accessToken, refreshToken });
        } else {
          const { accessToken } = await generateAccessToken(data);
          Object.assign(token, { accessToken, refreshToken: findToken?.getDataValue("refreshToken") });
        }
        await Token.update(
          { accessToken: token.accessToken, refreshToken: token.refreshToken },
          { where: { tokenId: user.getDataValue("tokenId") } }
        );
        return res.status(200).json({ success: true, data: { accessToken: token.accessToken } });
      }
    );
  } catch (error) {
    next(error);
  }
};

export default refreshToken;
