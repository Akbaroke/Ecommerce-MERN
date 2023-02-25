import { transports, createLogger, format } from "winston";

const logger = createLogger({
  transports: [new transports.Console({})],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.ms(),
    format.printf(({ timestamp, message, level, ms }) => {
      return `[${timestamp as string}] - ${ms as string} ${level}: ${message as string} `;
    })
  ),
});

export default logger;
