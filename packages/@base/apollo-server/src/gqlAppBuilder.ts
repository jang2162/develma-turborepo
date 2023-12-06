import { InjectorWrapper } from '@util/di';

import { GraphQLResolveInfo, GraphQLScalarType } from 'graphql/type';
import {
    GqlAppBuilderConfig,
    GqlAppBuilderContext,
    GqlAppBuilderMiddleware,
    GqlAppBuilderMiddlewareCallback,
} from './types';

export class GqlAppBuilder {
    constructor(private config: GqlAppBuilderConfig) {}

    build() {
        const typeDefs = this.config.typeDefs;
        const resolvers: any = {};
        for (const module of this.config.modules) {
            for (const typeName in module.resolvers) {
                if (module.resolvers[typeName] instanceof GraphQLScalarType) {
                    if (typeName in resolvers) {
                        throw Error('gqlAppBuilder build error. (already exist resolver type)');
                    }
                    resolvers[typeName] = module.resolvers[typeName];
                } else {
                    for (const fieldName in module.resolvers[typeName]) {
                        const middlewares: GqlAppBuilderMiddleware[] = [];
                        middlewares.push(
                            ...getMatchMiddlewares('*', '*', this.config.middlewares),
                            ...getMatchMiddlewares('*', '*', module.middlewares),
                            ...getMatchMiddlewares(typeName, '*', this.config.middlewares),
                            ...getMatchMiddlewares(typeName, '*', module.middlewares),
                            ...getMatchMiddlewares(typeName, fieldName, this.config.middlewares),
                            ...getMatchMiddlewares(typeName, fieldName, module.middlewares),
                        );

                        if (!(typeName in resolvers)) {
                            resolvers[typeName] = {};
                        }
                        if (resolvers[typeName][fieldName]) {
                            throw Error('gqlAppBuilder build error. (already exist resolver field)');
                        }

                        resolvers[typeName][fieldName] = async (
                            parent: any,
                            args: any,
                            ctx: GqlAppBuilderContext,
                            info: GraphQLResolveInfo,
                        ) => {
                            const callbacks: GqlAppBuilderMiddlewareCallback[] = [];
                            let resolveData: any;
                            let resolveError: any;
                            const injector = new InjectorWrapper(ctx.injector);
                            try {
                                for (const middleware of middlewares) {
                                    const cb = await middleware(injector, parent, args, info);
                                    if (cb) {
                                        callbacks.push(cb);
                                    }
                                }
                                resolveData = module.resolvers[typeName][fieldName](injector, parent, args, info);
                            } catch (error) {
                                resolveError = error;
                            }

                            callbacks.reverse();
                            for (const cb of callbacks) {
                                await cb(resolveData, resolveError);
                            }
                            if (resolveError) {
                                throw resolveError;
                            }
                            return resolveData;
                        };
                    }
                }
            }
        }
        return {
            typeDefs,
            resolvers,
        };
    }
}

function getMatchMiddlewares(
    typeName: string,
    fieldName: string,
    middlewares?: Record<string, Record<string, GqlAppBuilderMiddleware[]>>,
): GqlAppBuilderMiddleware[] {
    if (middlewares && typeName in middlewares && fieldName in middlewares[typeName]) {
        return middlewares[typeName][fieldName];
    }
    return [];
}
