import { nonNull, type } from "@/helpers/graphql/dsl";

import LongType from "@/graphql/shared/scalars/long";

import { GraphQLString } from "graphql";

export const Instance = type({
    fields: {
        id: { type: nonNull(LongType) },
        name: { type: GraphQLString },
    },
    name: "Instance",
});
