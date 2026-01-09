import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs-extra';
import { fileURLToPath } from 'url';

// Ensure logs folder exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, '../../logs');
fs.ensureDirSync(logsDir);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFile = path.join(logsDir, `automation-${timestamp}.log`);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFile })
  ]
});

export default logger;