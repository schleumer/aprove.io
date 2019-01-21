import {GraphQLEnumType, GraphQLString} from "graphql";
import {nonNull, type} from "@/helpers/graphql/dsl";
import LongType from "@/graphql/shared/scalars/long";

export const CustomerType = new GraphQLEnumType({
    name: 'CustomerType',
    values: {
        'NATURAL': {value: 'NATURAL'},
        'JURIDICAL': {value: 'JURIDICAL'}
    }
})

export const CustomerStatus = new GraphQLEnumType({
    name: 'CustomerStatus',
    values: {
        'ACTIVE': {value: 'ACTIVE'},
        'INACTIVE': {value: 'INACTIVE'}
    }
})

export const CustomerPhone = type({
    name: 'CustomerPhone',
    fields: {
        id: { type: nonNull(LongType) },
        customerId: { type: nonNull(LongType) },
        phone: { type: nonNull(GraphQLString)},
        position: { type: nonNull(LongType)},
    }
})

export const CustomerEmail = type({
    name: 'CustomerEmail',
    fields: {
        id: { type: nonNull(LongType) },
        customerId: { type: nonNull(LongType) },
        email: { type: nonNull(GraphQLString)},
        position: { type: nonNull(LongType)},
    }
})
