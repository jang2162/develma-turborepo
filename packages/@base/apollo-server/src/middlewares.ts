import { createLogger, SimpleLoggerOptions } from '@util/logger';
import { AbstractTransactionService } from './services/abstractTransactionService';
import { REQ_KEY } from './symbols';
import { GqlAppBuilderMiddleware } from './types';

export const createGqlLogMiddleware: (loggerOptions?: SimpleLoggerOptions) => GqlAppBuilderMiddleware = (
    loggerOptions,
) => {
    const logger = createLogger<{
        reqKey: string;
        type: string;
        fieldName: string;
    }>('GQL', {
        ...loggerOptions,
        consoleFormat: ({ level, message, subData, timestamp }) =>
            `${timestamp} [GQL] ${level}: #${subData.reqKey}# ${message}`,
    });
    return (injector, parent, args, info) => {
        const reqKey = injector.resolve<string>(REQ_KEY);
        const type = info.parentType.name;
        logger.info(`${type}(${info.fieldName}) called.`, {
            fieldName: info.fieldName,
            type,
            reqKey,
        });
    };
};

export const dbMiddleware: GqlAppBuilderMiddleware = async (injector) => {
    return async (resolveData, resolveError) => {
        if (resolveError) {
            const transactionService = injector.resolve<AbstractTransactionService>(AbstractTransactionService.token);
            transactionService.errorOccurred();
        }
    };
};
