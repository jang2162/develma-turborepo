import { CodegenConfig } from '@graphql-codegen/cli';
import { GraphQLScalarType } from 'graphql';
import { DateScalar } from './scalar/dateScalar';
import { DatetimeScalar } from './scalar/datetimeScalar';
import { TimestampScalar } from './scalar/timestampScalar';
import { VoidScalar } from './scalar/voidScalar';

const commonScalars = [DateScalar, DatetimeScalar, TimestampScalar, VoidScalar];
export class ScalarUtil {
    private scalars = new Set<GraphQLScalarType>();
    constructor(excludeCommonScalars: boolean = false) {
        if (!excludeCommonScalars) {
            commonScalars.forEach((scalar) => this.scalars.add(scalar));
        }
    }

    public addScalar(scalar: GraphQLScalarType) {
        this.scalars.add(scalar);
    }

    public getScalarArray() {
        return Array.from(this.scalars);
    }

    public getScalarMap() {
        return this.getScalarArray().reduce(
            (map, scalar) => ({
                ...map,
                [scalar.name]: scalar,
            }),
            {},
        );
    }
}

export const codegenConfig: CodegenConfig = {
    schema: ['typeDefs/**/*.graphql'],
    generates: {
        './generated-models.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
            config: {
                customResolverFn:
                    '(injector: TContext,parent: TParent,args: TArgs,info: GraphQLResolveInfo) => Promise<TResult> | TResult',
                scalars: {
                    Date: 'Date',
                    Datetime: 'Date',
                    Timestamp: 'Date',
                    Void: 'null',
                },
            },
            hooks: { afterOneFileWrite: ['eslint --fix', 'prettier --write'] },
        },
        './introspection.json': {
            plugins: ['introspection'],
            config: {},
        },
    },
};
