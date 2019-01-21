// export const user = async (a, b, c): Promise<any> => {
//   return b.session.user
// }
//
// export const instance = async (a, b, c): Promise<any> => {
//   return b.session.instance
// }

import auth from '@/helpers/auth'

import UserType from '@/graphql/shared/types/user'
import InstanceType from '@/graphql/shared/types/instance'

import { nonNull } from '@/helpers/graphql/dsl'
import { User, Instance } from '@/entity';

export default async () => ({
    currentUser: auth({
        type: nonNull(UserType),
        async resolve(source, args, ctx, info): Promise<User> {
            const { user } = await ctx.session()
            return user
        }
    }),
    currentInstance: auth({
        type: nonNull(InstanceType),
        async resolve(source, args, ctx, info): Promise<Instance> {
            const { instance } = await ctx.session()
            return instance
        }
    })
})
