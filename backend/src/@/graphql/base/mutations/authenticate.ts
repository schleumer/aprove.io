import * as R from 'ramda'
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import {JWT_KEY} from '@/config/keys'
import {Instance} from '@/entity/instance'
import {User} from '@/entity/user'
import {
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLFieldConfig
} from 'graphql';

import {type, nonNull} from '@/helpers/graphql/dsl'

import LongType from '@/graphql/shared/scalars/long';

import UserType from '@/graphql/shared/types/user';
import InstanceType from '@/graphql/shared/types/instance';

const AuthenticateInput = new GraphQLInputObjectType({
    name: 'AuthenticateInput',
    fields: {
        username: {type: nonNull(GraphQLString)},
        password: {type: nonNull(GraphQLString)},
        instance: {type: nonNull(GraphQLString)},
    }
})

const AuthenticateTokenInfo = type({
    name: 'AuthenticateTokenInfo',
    fields: {
        sub: {type: nonNull(LongType)},
        i: {type: nonNull(LongType)},
        iat: {type: nonNull(LongType)},
        exp: {type: nonNull(LongType)},
    }
})

const AuthenticateOutput = type({
    name: 'AuthenticateOutput',
    fields: {
        token: {type: nonNull(GraphQLString)},
        algo: {type: nonNull(GraphQLString)},
        type: {type: nonNull(GraphQLString)},
        tokenInfo: {type: nonNull(AuthenticateTokenInfo)},
        user: {type: nonNull(UserType)},
        instance: {type: nonNull(InstanceType)},
    }
})

const authenticate: GraphQLFieldConfig<any, any> = {
    type: AuthenticateOutput,
    args: {
        input: {type: AuthenticateInput}
    },
    async resolve(source, args, context, info) {
        const input = args.input
        let instance: Instance = null
        let user: User = null

        // const query = {}

        if (input.instance === "!guess") {
            user = await User.findOne({
                where: {
                    email: input.username
                }
            })

            if (R.isNil(user)) {
                throw new Error("[ERR1] User does not exists")
            }

            if (R.isNil(R.path(['instance', 'id'], user))) {
                throw new Error("[ERR2] That user requires that `instance` be different than `!guess`")
            }

            instance = user.instance
        } else {
            let requestedInstance = parseInt(input.instance)

            user = await User.findOne({
                where: {
                    email: input.username
                }
            })

            if (R.isNil(user)) {
                throw new Error("[ERR3] User does not exists")
            }

            if (user.instance !== null && requestedInstance !== user.instance.id) {
                throw new Error(`[ERR4] That user(${user.id}) can only access instance "${user.instance.name}"(${user.instance.id})`)
            }

            instance = await Instance.findOne(input.instance)

            user.instance = instance
        }

        if (R.isNil(instance)) {
            throw new Error("[ERR5] Instance does not exists")
        }

        if (R.isNil(user)) {
            throw new Error("[ERR6] Instance does not exists")
        }

        const passCheck = await bcrypt.compare(input.password, user.password)

        if (!passCheck) {
            throw new Error("[ERR7] Invalid password")
        }

        const token = jwt.sign({
            sub: user.id,
            i: instance.id
        }, JWT_KEY, {algorithm: 'HS512', expiresIn: '7d'})

        const tokenInfo = jwt.decode(token)

        return {
            token,
            tokenInfo,
            algo: 'JWT',
            type: 'Bearer',
            user,
            instance
        }
    }
}

export default async () => ({
    authenticate
})
