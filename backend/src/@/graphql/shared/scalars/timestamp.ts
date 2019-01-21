import { GraphQLScalarType } from "graphql";

import { Kind } from "graphql/language/kinds";

function coerceDate(value) {
    if (value === "") {
        throw new TypeError(
            "Invalid timestamp",
        );
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        throw new TypeError(
            "Invalid date: " + String(value),
        );
    }

    return date;
}

function parseTimestamp(ast) {
    if (ast.kind === Kind.STRING) {
        const date = new Date(ast.value);

        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    return null;
}

export default new GraphQLScalarType({
    description: `RFC2822 valid timestamp`,
    name: "Timestamp",
    parseLiteral: parseTimestamp,
    parseValue: coerceDate,
    serialize: coerceDate,
});
