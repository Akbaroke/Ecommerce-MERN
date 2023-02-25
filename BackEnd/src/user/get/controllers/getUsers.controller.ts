import { type Request, type Response, type NextFunction } from "express";
import User from "@model/user.model";
import Image from "@model/image.model";
import { Op } from "sequelize";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);
  const page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);
  const search = req.query.search === undefined || req.query.search === "" ? "" : req.query.search;
  const start = (page - 1) * limit;
  const end = page * limit;
  try {
    const users = await User.findAndCountAll({
      where: {
        nama: { [Op.like]: `%${search as string}%` },
      },
      attributes: ["id", "nama", "email", "status", "role"],
      order: [["updatedAt", "DESC"]],
      include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
      limit,
      offset: start,
    });
    const count = users.count;
    const pagination = {};
    Object.assign(pagination, { totalRow: users.count, totalPage: Math.ceil(count / limit) });
    if (end < count) {
      Object.assign(pagination, { next: { page: page + 1, limit, remaining: count - (start + limit) } });
    }
    if (start > 0) {
      Object.assign(pagination, { prev: { page: page - 1, limit, ramaining: count - (count - start) } });
    }
    if (page > Math.ceil(count / limit)) {
      Object.assign(pagination, { prev: { remaining: count } });
    }
    res.status(200).json({ success: true, pagination, data: users.rows });
  } catch (error) {
    next(error);
  }
};

export default getUsers;
