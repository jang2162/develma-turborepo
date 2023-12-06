import { IntrospectionUtil } from './IntrospectionUtil';

export interface InitBaseApolloClientOptions {
    endpointUrl: {
        csr: string;
        ssr: string;
        ws: string;
    };
    introspectionUtil: IntrospectionUtil;
}
