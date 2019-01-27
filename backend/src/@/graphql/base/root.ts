import { GraphQLFieldConfigMap } from "graphql";

import * as M from "./mutations";
import * as Q from "./queries";

import {
    GraphQLObjectType,
    GraphQLSchema,
} from "graphql";

interface IResult {
    schema: GraphQLSchema;
}

const mergeFields = (...obj: Array<() => Promise<GraphQLFieldConfigMap<any, any>>>) => {
    return Promise.all(
        obj.map((fn) => fn()),
    ).then((x) => x.reduce((a, b) => ({ ...a, ...b }), {}));
};

export default async (): Promise<IResult> => {
    const queryFields = await mergeFields(
        Q.ping,
        Q.currentSession,
        Q.users,
        Q.customers,
    );

    const mutationFields = await mergeFields(
        M.ping,
        M.authenticate,
        M.customers,
        M.users,
    );

    const schema = new GraphQLSchema({
        mutation: new GraphQLObjectType({
            fields: mutationFields,
            name: "RootMutationType",

        }),
        query: new GraphQLObjectType({
            fields: queryFields,
            name: "RootQueryType",
        }),
    });

    return { schema };
};
