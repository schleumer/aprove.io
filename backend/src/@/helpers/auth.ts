import { GraphQLFieldConfig } from "graphql";

import { AuthenticatedContext } from '@/graphql/shared/context';

export default function auth(schema: GraphQLFieldConfig<any, AuthenticatedContext>): GraphQLFieldConfig<any, AuthenticatedContext> {
    return {
        ...schema,
        resolve(source, args, context, info) {
            if (context instanceof AuthenticatedContext) {
                return schema.resolve(source, args, context, info);
            }

            throw new Error("[ERR16] Precisar estar autenticado.");
        },
    };
}
