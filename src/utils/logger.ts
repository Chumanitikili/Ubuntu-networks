import { env } from '../config/environment';
import * as Sentry from '@sentry/node';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel = env.LOG_LEVEL;
    if (env.SENTRY_DSN) {
      Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NODE_ENV,
      });
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  public error(message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error);
      if (error && env.SENTRY_DSN) {
        Sentry.captureException(error);
      }
    }
  }

  public warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), data);
    }
  }

  public info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), data);
    }
  }

  public debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), data);
    }
  }
}

export const logger = Logger.getInstance(); 