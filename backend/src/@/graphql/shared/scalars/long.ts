import { GraphQLScalarType } from "graphql";

import { Kind } from "graphql/language/kinds";

const MAX_LONG = 9223372036854775807;
const MIN_LONG = -9223372036854775808;

function coerceLong(value) {
    if (value === "") {
        throw new TypeError(
            `Long cannot represent non-integer value: (empty string), must be between ${MIN_LONG} and ${MAX_LONG}`,
        );
    }
    const num = Number(value);
    if (num !== num || num > MAX_LONG || num < MIN_LONG) {
        throw new TypeError(
            `Long cannot represent non-integer value: ${String(value)}, must be between ${MIN_LONG} and ${MAX_LONG}`,
        );
    }
    const int = Math.floor(num);
    if (int !== num) {
        throw new TypeError(
            `Long cannot represent non-integer value: ${String(value)}, must be between ${MIN_LONG} and ${MAX_LONG}`,
        );
    }
    return int;
}

function parseLong(ast) {
    if (ast.kind === Kind.INT) {
        const num = parseInt(ast.value, 10);
        if (num <= MAX_LONG && num >= MIN_LONG) {
            return num;
        }
    }
    return null;
}

export default new GraphQLScalarType({
    description:
        `The \`Long\` scalar type represents non-fractional signed whole numeric values.
    Long can represent values between -(2^53) + 1 and 2^53 - 1.`,
    name: "Long",
    parseLiteral: parseLong,
    parseValue: coerceLong,
    serialize: coerceLong,
});
