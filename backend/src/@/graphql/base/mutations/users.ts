import {GraphQLInputObjectType, GraphQLString} from "graphql";
import * as bcrypt from "bcrypt";

import LongType from '@/graphql/shared/scalars/long';
import { Search as UsersSearch } from '@/graphql/base/queries/users';
import {User} from "@/entity";
import {nonNull} from "@/helpers/graphql/dsl";
import auth from '@/helpers/auth';

const UpdateUserInput = new GraphQLInputObjectType({
    name: 'UpdateUserInput',
    fields: {
        id: {type: nonNull(LongType)},
        name: {type: GraphQLString}
    }
})

const UpdatePasswordInput = new GraphQLInputObjectType({
    name: 'UpdatePasswordInput',
    fields: {
        id: {type: nonNull(LongType)},
        currentPassword: {type: GraphQLString},
        newPassword: {type: nonNull(GraphQLString)},
        newPasswordConfirmation: {type: nonNull(GraphQLString)}
    }
})

export default async () => {
    const UsersSearchType = await UsersSearch()

    return {
        updateUser: auth({
            type: UsersSearchType.ItemType,
            args: {
                input: {type: UpdateUserInput}
            },
            async resolve(source, args, ctx, info) {
                const { instance } = await ctx.session()

                const input = args.input

                await User
                    .getRepository()
                    .createQueryBuilder()
                    .update()
                    .set({...input, updatedAt: new Date})
                    .where('id = :id AND instance_id = :instance', {id: input.id, instance: instance.id})
                    .execute()

                return await User.findOne(input.id)
            }
        }),
        updateUserPassword: auth({
            type: UsersSearchType.ItemType,
            args: {
                input: {type: UpdatePasswordInput}
            },
            async resolve(source, args, ctx, info) {
                const input = args.input

                const user = await User.findOne(input.id)

                console.log(user)

                if (input.newPassword !== input.newPasswordConfirmation) {
                    throw new Error("[ERR10] Passwords are not the same");
                }

                user.password = bcrypt.hashSync(input.newPassword, 12)
                user.updatedAt = new Date

                return user.save()
            }
        })
    }
}
