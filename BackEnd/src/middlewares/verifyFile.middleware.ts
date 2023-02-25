import upload from "@config/multer.config";
import { type Request, type Response, type NextFunction } from "express";

const verifyFile = (req: Request, res: Response, next: NextFunction) => {
  upload.single("image")(req, res, error => {
    if (error !== undefined && error.field === "image") {
      next(error);
      return;
    }
    if (req.file === undefined) {
      next();
      return;
    }
    req.body.image = req.file;
    next();
  });
};

export default verifyFile;
