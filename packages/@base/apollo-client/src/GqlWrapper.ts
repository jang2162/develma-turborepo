import { OperationVariables } from '@apollo/client';
import { DocumentNode } from 'graphql';

export class GqlWrapper<
    T = any,
    TVariables extends OperationVariables = OperationVariables,
> {
    constructor(private documentNode: DocumentNode) {}

    getDocumentNode() {
        return this.documentNode;
    }
}
