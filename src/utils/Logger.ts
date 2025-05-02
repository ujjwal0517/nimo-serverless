import { LogLevel } from "../enum/LogLevel";

export class Logger {
  static debug(message: string, context?: any) {
    this.log(LogLevel.DEBUG, message, context);
  }
  static info(message: string, context?: any) {
    this.log(LogLevel.INFO, message, context);
  }
  static error(message: string, context?: any) {
    this.log(LogLevel.ERROR, message, context);
  }

  private static log(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    const base = `[${level}] ${timestamp} - ${message}`;

    if (context) {
      if (typeof context === 'object') {
        console.log(base, JSON.stringify(context, null, 2));
      } else {
        console.log(base, context);
      }
    } else {
      console.log(base);
    }
  }
}