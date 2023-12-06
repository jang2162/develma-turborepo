import { createTransactionProvider } from '@util/knex-transaction';
import { createLogger, loggerEnvUtil } from '@util/logger';
import knex from 'knex';
import pg from 'pg';
import { Env } from './env';
pg.types.setTypeParser(20, function (val) {
    return parseInt(val, 10);
});

function convertToCamel(result: any) {
    return Object.keys(result).reduce((prev, item) => {
        prev[item.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())] = result[item];
        return prev;
    }, {} as any);
}
const knexLogger = createLogger('KNEX', {
    ...loggerEnvUtil(Env.LOG_KNEX_CONSOLE_LEVEL, Env.LOG_KNEX_FILE_LEVEL, Env.LOG_KNEX_FILE_DIR),
});

export const knexClient = knex({
    client: 'pg',
    postProcessResponse: (result) => {
        if (Array.isArray(result?.rows)) {
            result.rows = result.rows.map((row: any) => convertToCamel(row));
            return result;
        } else if (Array.isArray(result)) {
            return result.map((row) => convertToCamel(row));
        } else {
            return convertToCamel(result);
        }
    },
    connection: {
        host: Env.DB_HOST,
        port: Env.DB_PORT,
        database: Env.DB_NAME,
        user: Env.DB_USER,
        password: Env.DB_PASSWORD,
    },
    log: {
        warn(message) {
            knexLogger.warn(message);
        },
        error(message) {
            knexLogger.error(message);
        },
        deprecate(message) {
            knexLogger.info(message);
        },
        debug(message) {
            knexLogger.debug(message);
        },
    },
});

export const transactionProvider = createTransactionProvider(knexClient, {
    loggerOptions: loggerEnvUtil(Env.LOG_TRX_CONSOLE_LEVEL, Env.LOG_TRX_FILE_LEVEL, Env.LOG_TRX_FILE_DIR),
});
