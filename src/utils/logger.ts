import { AUTH_ERRORS } from '../constants/errors';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  context?: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${context} ${message}`;
  }

  info(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, options));
      if (options?.data) {
        console.info('Data:', options.data);
      }
    }
  }

  warn(message: string, options?: LogOptions): void {
    console.warn(this.formatMessage('warn', message, options));
    if (options?.data) {
      console.warn('Data:', options.data);
    }
  }

  error(message: string, error?: Error, options?: LogOptions): void {
    console.error(this.formatMessage('error', message, options));
    if (error) {
      console.error('Error:', error);
    }
    if (options?.data) {
      console.error('Data:', options.data);
    }
  }

  debug(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, options));
      if (options?.data) {
        console.debug('Data:', options.data);
      }
    }
  }
}

export const logger = Logger.getInstance(); 