import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogData<SUB_DATA> {
    level: LogLevel;
    message: string;
    label: string;
    timestamp: string;
    subData: SUB_DATA;
}

export interface LoggerOptions<SUB_DATA> {
    label: string;
    consoleLevel?: LogLevel;
    fileLevel?: LogLevel;
    dirname?: string;
    consoleFormat?: (data: SUB_DATA | any) => string;
}
export interface SimpleLoggerOptions {
    consoleLevel?: LogLevel;
    fileLevel?: LogLevel;
    dirname?: string;
}

export class Logger<SUB_DATA = { subLabel?: string }> {
    curLogger: winston.Logger;
    constructor(private options: LoggerOptions<SUB_DATA>) {
        const label = options.label;
        const consoleLevel = options.consoleLevel || 'info';
        const fileLevel = options.fileLevel || 'info';

        this.curLogger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: consoleLevel,
                    format: format.combine(
                        format.label({ label }),
                        format.timestamp(),
                        format.printf((info1) =>
                            (options.consoleFormat
                                ? options.consoleFormat(info1)
                                : `${info1.timestamp} [${label}${
                                      info1.subData && info1.subData.subLabel ? `:${info1.subData.subLabel}` : ''
                                  }] ${info1.level}: ${info1.message}`
                            )
                                .split('\n')
                                .join('\n    ')
                                .trim(),
                        ),
                    ),
                }),
                new DailyRotateFile({
                    level: fileLevel,
                    dirname: options.dirname,
                    filename: `${label}-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '30m',
                    zippedArchive: true,
                    format: format.combine(format.label({ label }), format.timestamp(), format.json()),
                }),
            ],
        });
    }

    log(level: 'debug' | 'info' | 'warn' | 'error', message: string, subData?: SUB_DATA): void {
        if (subData) {
            this.curLogger.log({
                level,
                message,
                subData,
            });
        } else {
            this.curLogger.log({ level, message });
        }
    }

    debug(message: string, subData?: SUB_DATA) {
        this.log('debug', message, subData);
    }

    info(message: string, subData?: SUB_DATA) {
        this.log('info', message, subData);
    }

    warn(message: string, subData?: SUB_DATA) {
        this.log('warn', message, subData);
    }

    error(message: string, subData?: SUB_DATA) {
        this.log('error', message, subData);
    }
}

export function createLogger<SUB_DATA = { subLabel?: string }>(
    label: string,
    options: {
        defaultLevel?: LogLevel;
        consoleLevel?: LogLevel;
        fileLevel?: LogLevel;
        dirname?: string;
        consoleFormat?: (data: SUB_DATA | any) => string;
    },
) {
    return new Logger<SUB_DATA>({
        label,
        ...options,
    });
}

export function loggerEnvUtil(consoleLevel?: LogLevel, fileLevel?: LogLevel, dirname?: string): SimpleLoggerOptions {
    return {
        dirname,
        consoleLevel,
        fileLevel,
    };
}
