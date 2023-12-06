import { InjectorWrapper } from '@util/di';
import { DocumentNode } from 'graphql';
import { GraphQLResolveInfo } from 'graphql/type';
import { DependencyContainer } from 'tsyringe';

export type GqlAppBuilderContext = {
    injector: DependencyContainer;
};

export type GqlAppBuilderMiddleware = (
    injector: InjectorWrapper,
    parent: any,
    args: any,
    info: GraphQLResolveInfo,
) => void | null | undefined | Promise<void | null | undefined | GqlAppBuilderMiddlewareCallback>;
export type GqlAppBuilderMiddlewareCallback = (
    resolveData: any,
    resolveError: any,
) => void | null | undefined | Promise<any>;
export interface GqlAppBuilderModule<RESOLVER = any> {
    middlewares?: Record<string, Record<string, GqlAppBuilderMiddleware[]>>;
    resolvers?: RESOLVER;
}

export interface GqlAppBuilderConfig {
    typeDefs: DocumentNode[];
    modules: GqlAppBuilderModule[];
    middlewares?: Record<string, Record<string, GqlAppBuilderMiddleware[]>>;
}

export interface IAccessToken {
    uid: number;
    rol: number[];
    exp: number;
    iss: string;
    sub: string;
    jti: string;
    rfk: string;
}
