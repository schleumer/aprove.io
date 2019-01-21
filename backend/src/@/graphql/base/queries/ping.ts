import { GraphQLString } from "graphql";

import auth from "@/helpers/auth";

import { FieldConfig, nonNull, type } from "@/helpers/graphql/dsl";

const PingQueryResult = type({
    fields: {
        message: { type: nonNull(GraphQLString) },
    },
    name: "PingQueryResult",
});

const field = {
    args: {
        message: { type: nonNull(GraphQLString) },
    },
    async resolve(source, args, context, info): Promise<{message: string}> {
        return { message: args.message };
    },
    type: PingQueryResult,
};

export default async (): FieldConfig => ({
    ping: field,
    pingAuth: auth(field),
});
