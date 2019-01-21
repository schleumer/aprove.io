import { GraphQLString, GraphQLEnumType} from "graphql";

import { type, nonNull } from '@/helpers/graphql/dsl'

import LongType from '@/graphql/shared/scalars/long';
import TimestampType from '@/graphql/shared/scalars/timestamp';

import Instance from './instance';

export const UserType = new GraphQLEnumType({
  name: 'UserType',
  values: {
      'ROOT': { value: 'ROOT' },
      'ADMIN': { value: 'ADMIN' },
      'EXTERNAL': { value: 'EXTERNAL' }
  }
})

export const UserStatus = new GraphQLEnumType({
    name: 'UserStatus',
    values: {
        'ACTIVE': { value: 'ACTIVE' },
        'INACTIVE': { value: 'INACTIVE' }
    }
})

export default type({
    name: 'User',
    fields: {
        id: { type: nonNull(LongType) },
        type: { type: nonNull(UserType) },
        status: { type: nonNull(UserStatus) },
        name: { type: GraphQLString },
        email: { type: nonNull(GraphQLString) },
        createdAt: { type: nonNull(TimestampType) },
        updatedAt: { type: TimestampType },
        deletedAt: { type: TimestampType },
        instance: { type: nonNull(Instance) }
    }
});
