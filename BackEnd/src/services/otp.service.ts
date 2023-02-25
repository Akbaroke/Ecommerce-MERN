import { Op } from "sequelize";
import Otp from "../models/otp.model";
import cron from "node-cron";

cron.schedule("*/5 * * * *", async () => {
  await Otp.destroy({
    where: {
      expiredAt: {
        [Op.lt]: Number(new Date().getTime()),
      },
    },
  });
});

export default cron;
