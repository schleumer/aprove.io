import { Instance } from '@/entity/instance';

import { search, sf } from "@/helpers/search";

import { memoAsync } from "@/helpers/prelude";

export const Search = memoAsync(async () => {
    return await search('Instance', 'Instances', Instance, [
        sf('id', true),
    ])
})

export default async () => {
    const instancesSearch = await Search();

    return {
        users: instancesSearch.All,
        user: instancesSearch.Single
    }
}
