import {
    GraphQLError,
    GraphQLScalarType,
    IntrospectionInputObjectType,
} from 'graphql';
import { DocumentNode, TypeNode } from 'graphql/language/ast';
import {
    IntrospectionInputTypeRef,
    IntrospectionOutputTypeRef,
    IntrospectionQuery,
} from 'graphql/utilities/getIntrospectionQuery';

export class IntrospectionUtil {
    private items: Array<GraphQLScalarType> = [];
    constructor(private introspectionData: IntrospectionQuery) {}
    addScalar(scalar: GraphQLScalarType) {
        this.items.push(scalar);
    }
    serialize(variables: Record<string, any>, query: DocumentNode) {
        const newVariables: Record<string, any> = {};
        for (const definition of query.definitions) {
            if (
                definition.kind === 'OperationDefinition' &&
                definition?.variableDefinitions
            ) {
                for (const variableDefinition of definition?.variableDefinitions ||
                    []) {
                    const valueKey = variableDefinition.variable.name.value;
                    newVariables[valueKey] = this.serializeFromAST(
                        variables[valueKey],
                        variableDefinition.type,
                        false,
                        !!variableDefinition.defaultValue,
                    );
                }
            }
        }
        return newVariables;
    }

    parseData(data: any, query: DocumentNode) {
        if (!data) {
            return data;
        }
        const returnData: any = {};

        for (const definition of query.definitions) {
            if (definition.kind === 'OperationDefinition') {
                const operation = definition.operation;
                const introspectionType =
                    this.introspectionData.__schema.types.find(
                        (item) =>
                            item.kind === 'OBJECT' &&
                            item.name ===
                                {
                                    query: 'Query',
                                    mutation: 'Mutation',
                                    subscription: 'Subscription',
                                }[operation],
                    );

                if (!introspectionType || introspectionType.kind !== 'OBJECT') {
                    throw new Error(`introspectionType ${operation}`);
                }

                for (const selection of definition.selectionSet.selections) {
                    if (selection.kind === 'Field') {
                        const name = selection.name.value;
                        const alias = selection.alias?.value || name;
                        const value = data[alias];
                        const type = introspectionType.fields.find(
                            (item) => item.name === name,
                        );
                        if (!type) {
                            throw new Error(`type: ${name}`);
                        }
                        returnData[alias] = this.parseObjectField(
                            value,
                            type.type,
                            false,
                        );
                    }
                }
            }
        }
        return returnData;
    }

    private serializeFromIntrospection(value: any, name: string) {
        const type = this.introspectionData.__schema.types.find(
            (item: any) => item.name === name,
        );
        if (!type) {
            throw new Error(`type: ${name}`);
        }
        if (type.kind === 'SCALAR') {
            return this.serializeScalar(value, name);
        } else if (type.kind === 'INPUT_OBJECT') {
            return this.serializeInputObject(value, type);
        }
        return value;
    }

    private serializeInputObject(
        value: any,
        type: IntrospectionInputObjectType,
    ): any {
        for (const field of type.inputFields) {
            if (field.name in value) {
                value[field.name] = this.serializeInputObjectField(
                    value[field.name],
                    field.type,
                    false,
                );
            }
        }
        return value;
    }

    private serializeInputObjectField(
        value: any,
        type: IntrospectionInputTypeRef,
        isNonNull: boolean,
    ): any {
        if (type.kind === 'SCALAR') {
            if (value || isNonNull) {
                return this.serializeScalar(value, type.name);
            }
        } else if (type.kind === 'INPUT_OBJECT') {
            if (value || isNonNull) {
                const inputObjectType =
                    this.introspectionData.__schema.types.find(
                        (item: any) => item.name === type.name,
                    );
                if (
                    !inputObjectType ||
                    inputObjectType.kind !== 'INPUT_OBJECT'
                ) {
                    throw new Error(`inputObjectType: ${type.name}`);
                }
                return this.serializeInputObject(value, inputObjectType);
            }
        } else if (type.kind === 'NON_NULL') {
            return this.serializeInputObjectField(value, type.ofType, true);
        } else if (type.kind === 'LIST') {
            if (Array.isArray(value)) {
                return value.map((item) =>
                    this.serializeInputObjectField(item, type.ofType, false),
                );
            }
        }
        return value;
    }

    private serializeScalar(value: any, name: string) {
        const scalarItem = this.items.find((item: any) => item.name === name);
        if (scalarItem) {
            return scalarItem.serialize(value);
        }
        return value;
    }

    private serializeFromAST(
        value: any,
        type: TypeNode,
        isNonNull: boolean,
        hasDefault = false,
    ): any {
        if (type.kind === 'NamedType') {
            if (value || isNonNull) {
                return this.serializeFromIntrospection(value, type.name.value);
            }
        } else if (type.kind === 'ListType') {
            if (Array.isArray(value)) {
                return value.map((item) =>
                    this.serializeFromAST(item, type.type, false),
                );
            } else if (isNonNull) {
                throw new GraphQLError('Variable not provide', type);
            }
        } else if (type.kind === 'NonNullType') {
            return this.serializeFromAST(value, type.type, !hasDefault);
        }
        return value;
    }

    private parseObject(data: Record<string, any>, name: string) {
        const returnData: any = {};
        const objectType = this.introspectionData.__schema.types.find(
            (item: any) => item.name === name && item.kind === 'OBJECT',
        );

        if (!objectType || objectType.kind !== 'OBJECT') {
            throw new Error(`objectType: ${name}`);
        }
        for (const field of objectType.fields) {
            if (field.name in data) {
                returnData[field.name] = this.parseObjectField(
                    data[field.name],
                    field.type,
                    false,
                );
            }
        }
        return returnData;
    }
    private parseObjectField(
        value: any,
        type: IntrospectionOutputTypeRef,
        isNonNull: boolean,
    ): any {
        if (type.kind === 'SCALAR') {
            if (value || isNonNull) {
                return this.parseScalar(value, type.name);
            }
        } else if (type.kind === 'OBJECT') {
            if (value || isNonNull) {
                return this.parseObject(value, type.name);
            }
        } else if (type.kind === 'NON_NULL') {
            return this.parseObjectField(value, type.ofType, true);
        } else if (type.kind === 'LIST') {
            if (Array.isArray(value)) {
                return value.map((item) =>
                    this.parseObjectField(item, type.ofType, false),
                );
            }
        }
        return value;
    }
    private parseScalar(value: any, name: string) {
        const scalarItem = this.items.find((item: any) => item.name === name);
        if (scalarItem) {
            return scalarItem.parseValue(value);
        }
        return value;
    }
}
