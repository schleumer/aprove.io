import { type, nonNull } from '@/helpers/graphql/dsl';

import LongType from '@/graphql/shared/scalars/long';

import TimestampType from '@/graphql/shared/scalars/timestamp';
import { GraphQLString } from 'graphql';

export default type({
    name: 'Instance',
    fields: {
        id: { type: nonNull(LongType) },
        name: { type: GraphQLString },
        createdAt: { type: nonNull(TimestampType) },
        updatedAt: { type: TimestampType },
        deletedAt: { type: TimestampType },
    }
});
