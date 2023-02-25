import multer from "multer";
import path from "path";

export default multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1000000, // 1mb
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("file type is not supported"));
      return;
    }

    const fileSize = file.size;
    if (fileSize > 1000000) {
      cb(new Error("file max 1 mb"));
      return;
    }
    cb(null, true);
  },
});
