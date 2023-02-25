import { Op } from "sequelize";
import User from "../models/user.model";
import cron from "node-cron";

cron.schedule("0 0 0 * * *", async () => {
  await User.destroy({
    where: {
      expiredAt: {
        [Op.lt]: Number(new Date().getTime()),
      },
    },
  });
});

export default cron;
