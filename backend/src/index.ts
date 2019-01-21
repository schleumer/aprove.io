import "tsconfig-paths/register";

import "reflect-metadata";
import "source-map-support/register";

import dotenv from "dotenv"

dotenv.config();

import fs from "fs";
import path from "path";

import * as msgpack from "msgpack";
import * as R from "ramda";

import db from "@/db";
import { graphql, introspectionQuery } from "graphql";

import buildContext from "@/graphql/base/context";

import koaPlayground from "graphql-playground-middleware-koa";

import { ApolloServer, Config } from "apollo-server-koa";

import cors = require("@koa/cors");
import Koa = require("koa");
import koaBody = require("koa-bodyparser");
import compress = require("koa-compress");
import KoaRouter = require("koa-router");
import rawBody = require("raw-body");
import pg = require("pg");

pg.types.setTypeParser(20, (value) => {
    return parseInt(value)
})

interface IEndpoint {
    name: string;
    description: string;
    alias: string;
    build: () => Promise<Config>;
}

const endpoints: IEndpoint[] = [
    { name: "base", alias: "base", description: "base", build: buildContext },
];

const boot = async () => {
    const app = new Koa();

    app.use(cors());

    const router = new KoaRouter();
    const PORT = 3000;

    app.use(compress({
        filter: (x) => true,
        flush: require("zlib").Z_SYNC_FLUSH,
        threshold: 1024,
    }));

    app.use(async (ctx, next) => {
        const type = R.path(["content-type"], ctx.request.headers);

        try {
            if (type === "application/msgpack+base64") {
                const body = await rawBody(ctx.req);

                ctx.request.headers["content-type"] = "application/json";

                if (body instanceof Buffer) {
                    ctx.request.body = msgpack.unpack(Buffer.from(body.toString(), "base64"));
                } else {
                    ctx.request.body = msgpack.unpack(Buffer.from(body, "base64"));
                }

                await next();
            } else if (type === "application/msgpack") {
                const body = await rawBody(ctx.req);

                ctx.request.headers["content-type"] = "application/json";
                ctx.request.body = msgpack.unpack(body);

                await next();
            } else {
                await next();
            }
        } catch (err) {
            console.log(err);
        }

        if (ctx.accepts("text/html", "application/msgpack") === "application/msgpack") {
            const newBody = JSON.parse(ctx.response.body);
            ctx.body = msgpack.pack(newBody);
            ctx.set("content-type", "application/msgpack");
        }
    });

    app.use(koaBody());

    for (const endpoint of endpoints) {
        const apolloServerConfig = await buildContext();
        const endpointRoot = `/${endpoint.alias}`;

        router.all('/', async (ctx, next) => {
            ctx.response.set('Content-Type', 'application/json');
            ctx.body = JSON.stringify({
                hello: 'world'
            })
        });

        // router.post('/graphql', graphqlKoa(builtContext));
        // router.get('/graphql', graphqlKoa(builtContext));
        router.get(`/${endpointRoot}/schema.json`, async (ctx, next) => {
            const { data } = await graphql(apolloServerConfig.schema, introspectionQuery);

            ctx.headers["Content-Type"] = "application/json";
            ctx.body = JSON.stringify(data, null, "  ");
        });

        router.get(`${endpointRoot}/graphiql`, async (ctx, next) => {
            const viewBuffer = fs.readFileSync(path.join(__dirname, "..", "views", "graphiql-workspace.html"));
            ctx.body = viewBuffer
                .toString()
                .replace(/\[ENDPOINT_TITLE\]/g, endpoint.name)
                .replace(/\[ENDPOINT_DESCRIPTION\]/g, endpoint.description)
                .replace(/\[ENDPOINT_OPTIONS\]/g, JSON.stringify({
                    defaultQuery: 'query {\n  ping(message: "Ok") {\n    message\n  }\n}',
                    defaultVariables: "{}",
                    name: endpoint.alias,
                    url: ctx.request.href.replace(/\/graphiql/, "/graphql"),
                }));
            ctx.set("content-type", "text/html");
            return next();
        });

        router.all(
            `${endpointRoot}/playground`,
            koaPlayground({
                endpoint: `${endpointRoot}/graphql`,
            }),
        );

        const apolloServer = new ApolloServer({...apolloServerConfig});

        apolloServer.applyMiddleware({ app, path: `${endpointRoot}/graphql` });
    }

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(PORT, () => {
        console.log(`Started server at localhost:${PORT}`);
    });
};

db.then(boot);
