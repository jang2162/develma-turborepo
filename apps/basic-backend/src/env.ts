import { envInit, envUtil } from '@util/env';
envInit();
export class Env {
    static readonly NODE_ENV = envUtil.string(process.env.NODE_ENV, 'development');
    static readonly SERVER_PORT = envUtil.int(process.env.SERVER_PORT, 4200);

    static readonly CORS_ORIGIN = envUtil.string(process.env.CORS_ORIGIN, 'http://localhost:4200');
    static readonly CORS_CREDENTIALS = envUtil.bool(process.env.CORS_CREDENTIALS, false);

    static readonly DB_HOST = envUtil.stringErr(process.env.DB_HOST);
    static readonly DB_PORT = envUtil.intErr(process.env.DB_PORT);
    static readonly DB_NAME = envUtil.stringErr(process.env.DB_NAME);
    static readonly DB_USER = envUtil.stringErr(process.env.DB_USER);
    static readonly DB_PASSWORD = envUtil.stringErr(process.env.DB_PASSWORD);

    static readonly LOG_DEFAULT_LEVEL = envUtil.logLevel(process.env.LOG_DEFAULT_LEVEL, 'info');
    static readonly LOG_DEFAULT_FILE_DIR = envUtil.string(process.env.LOG_DEFAULT_FILE_DIR, './logs');

    static readonly LOG_TRX_CONSOLE_LEVEL = envUtil.logLevel(process.env.LOG_TRX_CONSOLE_LEVEL, Env.LOG_DEFAULT_LEVEL);
    static readonly LOG_TRX_FILE_LEVEL = envUtil.logLevel(process.env.LOG_TRX_FILE_LEVEL, Env.LOG_DEFAULT_LEVEL);
    static readonly LOG_TRX_FILE_DIR = envUtil.string(process.env.LOG_TRX_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR);

    static readonly LOG_GQL_CONSOLE_LEVEL = envUtil.logLevel(process.env.LOG_DEFAULT_LEVEL, Env.LOG_DEFAULT_LEVEL);
    static readonly LOG_GQL_FILE_LEVEL = envUtil.logLevel(process.env.LOG_DEFAULT_LEVEL, Env.LOG_DEFAULT_LEVEL);
    static readonly LOG_GQL_FILE_DIR = envUtil.string(process.env.LOG_GQL_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR);

    static readonly LOG_APOLLO_CONSOLE_LEVEL = envUtil.logLevel(
        process.env.LOG_APOLLO_CONSOLE_LEVEL,
        Env.LOG_DEFAULT_LEVEL,
    );
    static readonly LOG_APOLLO_FILE_LEVEL = envUtil.logLevel(process.env.LOG_APOLLO_FILE_LEVEL, Env.LOG_DEFAULT_LEVEL);
    static readonly LOG_APOLLO_FILE_DIR = envUtil.string(process.env.LOG_APOLLO_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR);

    static readonly LOG_KNEX_CONSOLE_LEVEL = envUtil.logLevel(
        process.env.LOG_KNEX_CONSOLE_LEVEL,
        Env.LOG_DEFAULT_LEVEL,
    );
    static readonly LOG_KNEX_FILE_LEVEL = envUtil.logLevel(process.env.LOG_KNEX_FILE_LEVEL, Env.LOG_DEFAULT_LEVEL);
    static readonly LOG_KNEX_FILE_DIR = envUtil.string(process.env.LOG_KNEX_FILE_DIR, Env.LOG_DEFAULT_FILE_DIR);
}
