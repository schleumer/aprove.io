import { User } from '@/entity/user';

import { search, sf, sfOutput } from "@/helpers/search";

import InstanceType from '@/graphql/shared/types/instance';

import { memoAsync } from "@/helpers/prelude";

// import { Search as InstancesSearch } from './instances';

export const Search = memoAsync(async () => {
    // const instancesSearch = await InstancesSearch();

    return await search('User', 'Users', User, [
        sf('id', true),
        sf('name', true),
        sf('type', true),
        sf('status', true),
        sf('email', true),
        sf('createdAt', true),
        sf('updatedAt', true),
        sf('deletedAt', true),
        sfOutput('instance', InstanceType, async (row: User) => {
            return await row.instance
        }),
        // sfInput(
        //     'blabla1',
        //     GraphQLString,
        //     (t, q, v) => q.andWhere(`${t}.name = :name`, {'name': v})
        // ),
        // sfBoth(
        //     'blabla2',
        //     GraphQLString,
        //     LongType,
        //     (t, q, v) => q.andWhere(`${t}.name = :name`, {'name': v}),
        //     (row) => row.id + 999
        // )
    ], (t, q, s) => {
        return q
            .leftJoinAndSelect(`${t}.instance`, 'instance')
            .andWhere(`${t}.instance = :instanceId`, {instanceId: s.instance.id})
            .andWhere(`${t}.type <> 'EXTERNAL'` )
            .andWhere(`${t}.status = 'ACTIVE'` )
            .orderBy(`${t}.updatedAt`, 'DESC', 'NULLS LAST')
    })
})

export default async () => {
    const usersSearch = await Search();

    return {
        users: usersSearch.All,
        user: usersSearch.Single
    }
}
