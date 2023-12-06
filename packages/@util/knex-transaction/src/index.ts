import { createLogger, SimpleLoggerOptions } from '@util/logger';
import { range } from '@util/tools';
import { Knex } from 'knex';

import Timeout = NodeJS.Timeout;

interface TrxLoggerSubData {
    // debug
    queryText?: string;
    queryTextBind?: string;
    params?: any[];
    rowCount?: number;
    duration?: number;

    // error
    code?: string;
    position?: string;
}

export async function createTransactionProvider(
    client: Knex,
    options: {
        loggerOptions?: SimpleLoggerOptions;
    },
) {
    const trxLogger = createLogger<TrxLoggerSubData>('TRX', {
        ...options?.loggerOptions,
        consoleFormat: ({ level, message, subData, timestamp }) =>
            `${timestamp} [TRX] ${level}: ${
                level === 'debug'
                    ? `executed query\nQuery: ${subData.queryTextBind}\nDuration: ${subData.duration}ms\nRowCount: ${
                          subData.rowCount
                      }${
                          subData.params && subData.params.length > 0
                              ? `\nParams: (${range(subData.params.length)
                                    .map((idx: number) => `$${idx + 1}=>${subData.params[idx]}`)
                                    .join(', ')})`
                              : ''
                      }`
                    : level === 'error'
                    ? `(${subData.code}, ${subData.position}) ${message}`
                    : message
            }`,
    });

    return async function () {
        const trx = await client.transaction();
        const queryList: Array<{
            text: string;
            duration: number;
            id: string;
            start: number;
            params?: any[];
        }> = [];
        let timeout: Timeout;
        const startListener = (builder: Knex) => {
            builder
                .on('query', (data) => {
                    if (queryList.length === 0) {
                        timeout = setTimeout(() => {
                            trxLogger.warn(
                                'A client has been checked out for more than 5 seconds!\n' +
                                    `QueryList: [{${queryList
                                        .map((a) => `\n\tQuery: ${a.text}\n\tDuration: ${a.duration}ms\n`)
                                        .join('}, {')}}]`,
                            );
                        }, 5000);
                    }
                    queryList.push({
                        duration: -1,
                        text: data.sql,
                        params: data.bindings,
                        id: data.__knexQueryUid,
                        start: Date.now(),
                    });
                })
                .on('query-response', (response, data) => {
                    const item = queryList.find((value) => value.id === data.__knexQueryUid);
                    if (item) {
                        item.duration = Date.now() - item.start;
                        trxLogger.debug('query executed.', {
                            queryText: item.text,
                            queryTextBind: item.text,
                            params: item.params && item.params.length > 0 ? item.params : undefined,
                            duration: item.duration,
                            rowCount: data.response.rowCount,
                        });
                    }
                })
                .on('query-error', (error, obj) =>
                    trxLogger.error(error.message, {
                        code: error.code,
                        position: error.position,
                        queryText: obj.sql,
                    }),
                );
        };
        trx.on('start', startListener);
        return {
            trx,
            release: async (err = false) => {
                trx.client.removeListener('start', startListener);
                if (timeout) {
                    clearTimeout(timeout);
                }

                if (!err) {
                    await trx.commit();
                } else {
                    await trx.rollback();
                }
            },
        };
    };
}
