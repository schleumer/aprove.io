import DataLoader from 'dataloader'

import R from 'ramda'

import { Context as KoaContext } from 'koa'

import * as jwt from "jsonwebtoken";

import { User, Instance } from '@/entity'

import { JWT_KEY } from '@/config/keys'

import * as graphqlLoaders from "@/graphql/base/loaders";

interface IJWTPayload {
    cli: string;
    sub: string;
}

export interface ISession {
    user: User
    instance: Instance
}

const authenticatedSessionsContext: { [key: string]: ISession } = {}

const makeAuthenticatedSsession = async (req: KoaContext): Promise<ISession> => {
    const auth = req.request.get("authorization");

    if (auth !== null && auth !== "") {
        if (authenticatedSessionsContext.hasOwnProperty(auth)) {
            return authenticatedSessionsContext[auth];
        }

        const [, token] = auth.split(/ /g)

        const payload = jwt.verify(token, JWT_KEY) as IJWTPayload;

        if (payload === null) {
            throw new Error("[ERR11] Invalid session token, login is needed")
        }

        const user = await User.findOne({
            where: {
                id: payload['sub']
            }
        })

        const instance = await Instance.findOne({
            where: {
                id: payload['i']
            }
        })

        if (!R.isNil(user) && !R.isNil(instance)) {
            user.instance = instance

            const res = { user, instance }

            authenticatedSessionsContext[auth] = res

            return res
        }

        throw new Error("[ERR12] Invalid session token, login is needed")
    }

    return { user: null, instance: null };
};

export abstract class BaseContext {
    constructor (protected ctx: KoaContext) {}
    abstract session (): Promise<ISession>
    abstract loader (name: string): DataLoader<any, any>
}

export class AuthenticatedContext extends BaseContext {
    protected cachedSession: ISession = null
    protected cachedLoaders = {}
    async session () {
        if (this.cachedSession) {
            return this.cachedSession;
        }

        this.cachedSession = await makeAuthenticatedSsession(this.ctx);

        return this.cachedSession;
    }
    loader (name: string): DataLoader<any, any> {
        if (this.cachedLoaders.hasOwnProperty(name)) {
            return this.cachedLoaders[name];
        }

        if (!graphqlLoaders.hasOwnProperty(name)) {
            throw new Error(`[ERR13] Loader ${name} is not registered`);
        }

        const loaderDef = graphqlLoaders[name]

        this.cachedLoaders[name] = loaderDef(this);

        return this.cachedLoaders[name];
    }
}

export class GuestContext extends BaseContext {
    protected cachedLoaders = {}
    async session (): Promise<ISession> {
        throw new Error("[ERR14] Invalid session token, login is needed")
    }
    loader (name: string): DataLoader<any, any> {
        if (this.cachedLoaders.hasOwnProperty(name)) {
            return this.cachedLoaders[name];
        }

        if (!graphqlLoaders.hasOwnProperty(name)) {
            throw new Error(`[ERR15] Loader ${name} is not registered`);
        }

        const loader = new DataLoader(graphqlLoaders[name]);

        this.cachedLoaders[name] = loader;

        return loader;
    }
}

export type AnyContext = AuthenticatedContext | GuestContext

const hasTokenQueryString = R.pathSatisfies(R.pipe(R.isNil, R.not), ['token'])

export const guessContext = async (ctx: KoaContext): Promise<AnyContext> => {
    if (ctx.request.get('authorization') || hasTokenQueryString(ctx.request.query)) {
        return new AuthenticatedContext(ctx)
    }

    return new GuestContext(ctx)
}
