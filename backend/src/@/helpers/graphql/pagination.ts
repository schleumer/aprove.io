import {
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLObjectType,
} from "graphql";

import {listOf, nonNull} from "@/helpers/graphql/dsl";

import LongType from "@/graphql/shared/scalars/long";

import {BaseEntity, FindManyOptions} from "typeorm";

import db from "@/db";

export const Input = new GraphQLInputObjectType({
    name: "PaginationInput",
    fields: {
        page: {type: nonNull(LongType)},
        limit: {type: nonNull(LongType)},
    },
});

export interface IRequest {
    page: number;
    limit: number;
}

export interface IResponse<T> {
    items: T[];
    total: number;
    fromOffset: number;
    toOffset: number;
    remaining: number;
    totalOnPage: number;
    totalOfPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasMore: boolean;
}

export const of = (name: string, type: GraphQLObjectType): GraphQLObjectType => {
    return new GraphQLObjectType({
        name,
        fields: {
            items: {type: listOf(type)},
            total: {type: nonNull(LongType)},
            fromOffset: {type: nonNull(LongType)},
            toOffset: {type: nonNull(LongType)},
            remaining: {type: nonNull(LongType)},
            totalOnPage: {type: nonNull(LongType)},
            totalOfPages: {type: nonNull(LongType)},
            currentPage: {type: nonNull(LongType)},
            itemsPerPage: {type: nonNull(LongType)},
            hasMore: {type: nonNull(GraphQLBoolean)},
        },
    });
};

export const paginate = async <T extends BaseEntity>(
    request: IRequest,
    model: { new(): T },
    findOptions: FindManyOptions<T>,
): Promise<IResponse<T>> => {
    const resolvedDb = await db;

    const repo = resolvedDb.getRepository(model);

    const limit = request.limit;

    const currentPage = Math.max(request.page, 1);

    if (limit > 0) {
        findOptions.take = limit;
        findOptions.skip = (currentPage - 1) * limit;
    } else {
        findOptions.skip = 0;
    }

    console.time("repo:count");

    const total = await repo.count(findOptions);

    console.timeEnd("repo:count");

    console.time("repo:find");

    const items = await repo.find(findOptions);

    console.timeEnd("repo:find");

    console.time("repo:calcs");

    const itemsPerPage = (limit === -1) ? total : limit;
    const totalOnPage = Math.min(itemsPerPage, items.length);

    const toOffset = ((currentPage - 1) * itemsPerPage) + Math.min(itemsPerPage, totalOnPage);
    const fromOffset = toOffset - Math.min(itemsPerPage, totalOnPage);

    const remaining = Math.max(0, total - toOffset);
    const hasMore = remaining > 0;

    const totalOfPages = (limit === -1) ? 1 : Math.ceil(items.length / limit);

    console.timeEnd("repo:calcs");

    return {
        items,
        total,
        fromOffset,
        toOffset,
        remaining,
        totalOnPage,
        totalOfPages,
        currentPage,
        itemsPerPage,
        hasMore,
    };
};
