import buildRoot from "./root";

import { Config } from "apollo-server-koa";

import { guessContext, AnyContext } from '@/graphql/shared/context'
import { Context as KoaContext } from "koa";

export default async function(): Promise<Config> {
    const { schema } = await buildRoot();

    return {
        context: async ({ ctx }: { ctx: KoaContext }): Promise<AnyContext> => {
            return guessContext(ctx)
        },
        schema,
        tracing: true,
    };
}
