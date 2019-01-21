import {
    GraphQLFieldConfigMap,
    GraphQLInputObjectType,
    GraphQLInputObjectTypeConfig,
    GraphQLList,
    GraphQLNonNull,
    GraphQLNullableType,
    GraphQLObjectType,
    GraphQLObjectTypeConfig,
} from "graphql";

export type FieldConfig = Promise<GraphQLFieldConfigMap<any, any>>;
export type FieldConfigFn = () => FieldConfig;

export const type = <a, b>(config: GraphQLObjectTypeConfig<a, b>) => {
    return new GraphQLObjectType(config);
};

export const input = (config: GraphQLInputObjectTypeConfig) => {
    return new GraphQLInputObjectType(config);
};

export const nonNull = <T extends GraphQLNullableType>(value: T) => {
    return new GraphQLNonNull(value);
};

export const listOf = (value) => {
    return new GraphQLList(nonNull(value));
};
