import { type Request, type Response, type NextFunction } from "express";
import Token from "../models/token.model";
import jwt from "jsonwebtoken";

const findTokenInDatabase = async (token: string): Promise<boolean> => {
  const findToken = await Token.findOne({ where: { accessToken: token } });
  if (findToken === null) {
    return false;
  } else {
    return true;
  }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader === undefined) return res.status(499).json({ success: false, error: { message: "token required" } });
    const token = authHeader.split(" ")[1];
    const findToken = await findTokenInDatabase(token);
    if (!findToken) return res.status(400).json({ success: false, error: { message: "token invalid" } });
    jwt.verify(token, process.env.ACCESSTOKENSECRET as string, async (error, decoded): Promise<any> => {
      if (error !== null) return res.status(401).json({ status: false, error: { message: error.message } });
      req.USER = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const verifyTokenAndAuthorization = (req: Request, res: Response, next: NextFunction): any => {
  try {
    return verifyToken(req, res, () => {
      const { userId, role } = req.USER;
      if (role === "admin" || userId === req.params.userId) {
        next();
        return;
      }
      res.status(403).json({
        success: false,
        message: "You are not alowed to do that",
      });
    });
  } catch (error) {
    next(error);
  }
};

const verifyTokenAdmin = (req: Request, res: Response, next: NextFunction): any => {
  try {
    return verifyToken(req, res, () => {
      const { role } = req.USER;
      if (role === "admin") {
        next();
        return;
      }
      res.status(403).json({
        success: false,
        message: "You are not alowed to do that",
      });
    });
  } catch (error) {
    next(error);
  }
};

const checkExpiredToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader === undefined) return res.status(499).json({ success: false, error: { message: "token required" } });
    const token = authHeader.split(" ")[1];
    const findToken = await findTokenInDatabase(token);
    if (!findToken) return res.status(400).json({ success: false, error: { message: "token invalid" } });
    jwt.verify(token, process.env.ACCESSTOKENSECRET as string, async (error, _decoded): Promise<any> => {
      if (error == null)
        return res.status(401).json({
          success: false,
          error: { message: "Your token has not expired" },
        });
      req.USER = { token };
      next();
    });
  } catch (error) {
    next(error);
  }
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAdmin, checkExpiredToken };
