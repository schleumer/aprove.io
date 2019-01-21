import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFieldConfig,
    GraphQLFieldConfigMap,
    GraphQLInputFieldConfigMap,
    GraphQLInputObjectType,
    GraphQLInputType,
    GraphQLList,
    GraphQLOutputType,
    GraphQLResolveInfo,
    GraphQLScalarType,
    GraphQLString,
    Kind,
} from "graphql";
import * as R from "ramda";
import {BaseEntity, Brackets, Connection, Repository, SelectQueryBuilder, WhereExpression} from "typeorm";

import * as uuid from "uuid";

import {camelCase, titleCase} from "typeorm/util/StringUtils";

import * as dsl from "@/helpers/graphql/dsl";

import db from "@/db";

import { AuthenticatedContext, BaseContext } from "@/graphql/shared/context";
import LongType from "@/graphql/shared/scalars/long";
import TimestampType from "@/graphql/shared/scalars/timestamp";

type InputFn<Value> = (tableName: string, q: WhereExpression, value: Value) => WhereExpression;

type OutputFn<Source, Context, Args, Output> =
    (source: Source, args: Args, context: Context, info: GraphQLResolveInfo) =>
        Promise<Output> | Output;

interface IField<Source, Context, Args, Output, Value> {
    name: string;
    allowOperators?: boolean;
    searchable?: boolean;
    outputType?: GraphQLOutputType;
    inputType?: GraphQLInputType;
    input?: InputFn<Value>;
    output?: OutputFn<Source, Context, Args, Output>;
}

const genId = <T>(fn: (...id: string[]) => T): T => {
    const genid = uuid.v4();

    return fn(genid.replace(/-/g, "_"));
};

// const parseInputFields = <Source, Context, Args, Output, Value>(
//     map: Array<IField<Source, Context, Args, Output, Value>>,
// ): GraphQLInputFieldConfigMap => {
//     return map.map(
//         (value: IField<Source, Context, Args, Output, Value>): GraphQLInputFieldConfigMap => {
//             return {
//                 [value.name]: {
//                     type: value.inputType,
//                 },
//             };
//         },
//     ).reduce((a, b) => ({...a, ...b}), {});
// };

function coerceString(value: any): string | null {
    if (Array.isArray(value)) {
        throw new TypeError(
            `String cannot represent an array value: [${String(value)}]`,
        );
    }
    return String(value);
}

const NonSearchableField = (name, type) => new GraphQLScalarType({
    description: `Could not parse type ${type} in runtime`,
    name: `NonSearchableField_${name}_${type}`,
    parseValue: coerceString,
    parseLiteral(ast) {
        return ast.kind === Kind.STRING ? ast.value : undefined;
    },
    serialize: coerceString,
});

const getInputType = <Source, Context, Args, Output, Value>(
    field: ConfiguredField<Source, Context, Args, Output, Value>,
    name: string, typeOrmType: any,
): GraphQLInputType => {
    switch (typeOrmType) {
        case Number:
            return LongType;
        case String:
            return GraphQLString;
        case Date:
            return TimestampType;
        case "enum":
            return makeEnumType(name, field.values);
        default:
            return NonSearchableField(name, typeOrmType);
    }
};

const getOutputType = <Source, Context, Args, Output, Value>(
    field: ConfiguredField<Source, Context, Args, Output, Value>,
    name: string, typeOrmType: any,
): GraphQLOutputType => {
    switch (typeOrmType) {
        case Number:
            return LongType;
        case String:
            return GraphQLString;
        case Date:
            return TimestampType;
        case "enum":
            return makeEnumType(name, field.values);
        default:
            return NonSearchableField(name, typeOrmType);
    }
};

const mergeMapArray = <T extends object>(r: T[]): T => {
    return r.reduce((l, next) => {
        return Object.assign({}, l, next);
    });
};

class MetaField {
    constructor(
        public name: string,
        public path: string[],
        public type: any,
        public getter: (_: string) => any,
        public values: string[],
    ) {
    }
}

interface IMetaFields {
    [k: string]: MetaField;
}

interface IOperators<T> {
    gt?: T;
    eq?: T;
    lt?: T;
    gte?: T;
    lte?: T;
    contains?: T;
    in?: T[];
    notIn?: T[];
}

interface IResult<T> {
    total: number;
    totalUnfiltered: number;
    remaining: number;
    fromOffset: number;
    toOffset: number;
    totalOnPage: number;
    totalOfPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasMore: boolean;
    items: T[];
}

const registeredOperators = {};
const registeredEnums = {};

const makeEnumType = (name: string, values: string[]) => {
    if (registeredEnums[name]) {
        return registeredEnums[name];
    }

    const v = new GraphQLEnumType({
        name: name + "Enum",
        values: values.reduce((all, value) => {
            return {
                ...all,
                [value]: {value},
            };
        }, {}),
    });

    registeredEnums[name] = v;

    return v;
};

const makeOperatorsType = (name: string, underlying: GraphQLInputType) => {
    if (registeredOperators.hasOwnProperty(name)) {
        return registeredOperators[name];
    }

    const type = new GraphQLInputObjectType({
        fields: {
            contains: {type: underlying},
            eq: {type: underlying},
            gt: {type: underlying},
            gte: {type: underlying},
            in: {type: new GraphQLList(dsl.nonNull(underlying))},
            lt: {type: underlying},
            lte: {type: underlying},
            notIn: {type: new GraphQLList(dsl.nonNull(underlying))},
        },
        name: name + "Operators",
    });

    registeredOperators[name] = type;

    return type;
};

class ConfiguredField<Source, Context, Args, Output, Value> {

    constructor(
        private conn: Connection,
        private repository: Repository<Source>,
        private field: IField<Source, Context, Args, Output, Value>,
        private meta?: MetaField,
    ) {
    }

    get allowOperators(): boolean {
        return this.field.allowOperators || false;
    }

    get name() {
        return this.field.name;
    }

    get bigName() {
        return titleCase(this.repository.metadata.name + " " + this.field.name).replace(/\s/g, "");
    }

    get values() {
        return this.meta.values;
    }

    public forGraphQLInput(): GraphQLInputFieldConfigMap {
        const map = {};

        if (!R.isNil(this.field.inputType)) {
            map[this.field.name] = {
                type: this.field.inputType,
            };
        } else if (!R.isNil(this.meta)) {
            map[this.field.name] = {
                type: getInputType(this, this.bigName, this.meta.type),
            };
        }

        if (this.field.allowOperators && map.hasOwnProperty(this.field.name)) {
            const opName = this.field.name + "Op";
            const def = map[this.field.name];

            let typeName = null;
            if (def.type.hasOwnProperty("name")) {
                typeName = def.type.name;
            } else {
                typeName = titleCase(opName);
            }

            map[opName] = this.buildOperators(typeName, def.type);
        }

        return map;
    }

    public forGraphQLOutput(): GraphQLFieldConfigMap<any, any> {
        const map: GraphQLFieldConfigMap<any, any> = {};
        const self = this;

        let resolve = null;

        if (R.isNil(this.field.output)) {
            resolve = function resolveAuto(source) {
                return self.meta.getter(source);
            };
        } else {
            resolve = function resolveManual(source, args, context, info) {
                return self.field.output(source, args, context, info);
            };
        }

        if (!R.isNil(this.field.outputType)) {
            map[this.field.name] = {
                resolve,
                type: this.field.outputType,
            };
        } else if (!R.isNil(this.meta)) {
            map[this.field.name] = {
                resolve,
                type: getOutputType(this, this.bigName, this.meta.type),
            };
        }

        return map;
    }

    public query(tableName: string, qb: WhereExpression, value: any, isOperators: boolean) {
        const escapedName = this.conn.driver.escape(tableName);

        if (!isOperators) {
            if (!R.isNil(this.field.input)) {
                return this.field.input(tableName, qb, value);
            } else {
                return qb.andWhere(
                    `${escapedName}.${this.field.name} = :value`,
                    {value},
                );
            }
        }

        const operators = (value || {}) as IOperators<string>;

        if (!R.isEmpty(operators)) {
            const cleanName = this.field.name.replace(/Op$/, "");
            return R.pipe(
                R.toPairs,
                R.reduce((nextQb, [a, b]) => {
                    if (R.isNil(b)) {
                        return nextQb;
                    }

                    switch (a) {
                        case "eq":
                            return genId((id) => nextQb.andWhere(
                                `${escapedName}.${cleanName} = :${id}`,
                                {[id]: b},
                            ));
                        case "lt":
                            return genId((id) => nextQb.andWhere(
                                `${escapedName}.${cleanName} < :${id}`,
                                {[id]: b},
                            ));
                        case "lte":
                            return genId((id) => nextQb.andWhere(
                                `${escapedName}.${cleanName} <= :${id}`,
                                {[id]: b},
                            ));
                        case "gt":
                            return genId((id) => nextQb.andWhere(
                                `${escapedName}.${cleanName} > :${id}`,
                                {[id]: b},
                            ));
                        case "gte":
                            return genId((id) => nextQb.andWhere(
                                `${escapedName}.${cleanName} >= :${id}`,
                                {[id]: b},
                            ));
                        case "contains":
                            return genId((id) => nextQb.andWhere(
                                `LAZY_TEXT(${escapedName}.${cleanName}::TEXT) LIKE LAZY_TEXT(:${id}::TEXT)`,
                                {[id]: `%${b}%`},
                            ));
                        case "in":
                            console.assert(Array.isArray(b));
                            return genId((id) => nextQb.andWhere(
                                `${escapedName}.${cleanName} IN (:...${id})`,
                                {[id]: b},
                            ));
                        case "notIn":
                            console.assert(Array.isArray(b));
                            return genId((id) => nextQb.andWhere(
                                `NOT ${escapedName}.${cleanName} IN (:...${id})`,
                                {[id]: b},
                            ));
                    }

                    return nextQb;
                }, qb),
            )(operators);
        }

        return qb;
    }

    private buildOperators(name: string, type: GraphQLInputType) {
        const inputType = makeOperatorsType(name, type);

        return {
            name,
            type: inputType,
        };
    }
}

class ConfiguredFields<Source, Context, Args, Output> {
    constructor(
        public repository: Repository<Source>,
        public fields: Array<ConfiguredField<Source, Context, Args, Output, any>> = [],
    ) {
    }

    public get(name: string): ConfiguredField<Source, Context, Args, Output, any> {
        return this.fields.find((_) => _.name === name);
    }

    public forGraphQLInput(): GraphQLInputFieldConfigMap {
        return mergeMapArray(this.fields.map((_) => _.forGraphQLInput()));
    }

    public forGraphQLOutput(): GraphQLFieldConfigMap<any, any> {
        return mergeMapArray(this.fields.map((_) => _.forGraphQLOutput()));
    }

    public query(tableName: string, qb: WhereExpression, data: object) {
        return R.pipe(
            R.toPairs,
            R.reduce((q, [name, value]: [string, any]) => {
                let realName = name;
                let isOperators = false;

                if (name.endsWith("Op")) {
                    realName = realName.replace(/Op$/, "");
                    isOperators = true;
                }

                const field = this.fields.find((_) => _.name === realName);

                if (!R.isNil(field)) {
                    return field.query(tableName, q, value, isOperators);
                }

                return q;
            }, qb),
        )(data);
    }
}

export function sf<Source, Context, Args, Output, Value>(
    name: string,
    allowOperators: boolean = false,
): IField<Source, Context, Args, Output, Value> {
    return {name, allowOperators};
}

export function sfOutput<Source, Context, Args, Output, Value>(
    name: string, outputType: GraphQLOutputType,
    output: OutputFn<Source, Context, Args, Output>,
): IField<Source, Context, Args, Output, Value> {
    return {
        name,
        output,
        outputType,
    };
}

export function sfInput<Source, Context, Args, Output, Value>(
    name: string, inputType: GraphQLInputType,
    input: InputFn<Value>,
): IField<Source, Context, Args, Output, Value> {
    return {
        input,
        inputType,
        name,
    };
}

export function sfBoth<Source, Context, Args, Output, Value>(
    name: string,
    inputType: GraphQLInputType,
    outputType: GraphQLOutputType,
    input: InputFn<Value>,
    output: OutputFn<Source, Context, Args, Output>,
): IField<Source, Context, Args, Output, Value> {
    return {
        input,
        inputType,
        name,
        output,
        outputType,
    };
}

type SearchPreQuerySignature<S> =
    (tableName: string, qb: SelectQueryBuilder<S>, session: any) => SelectQueryBuilder<S>;

export const search = async <Source extends BaseEntity, Context, Args>(
    itemName: string,
    listName: string,
    entity: new() => Source,
    fields: Array<IField<Source, Context, Args, any, any>> = [],
    preQuery: SearchPreQuerySignature<Source> = (_, q) => q,
) => {
    const conn = await db;

    const repository = conn.getRepository(entity);

    const meta: IMetaFields = conn.getMetadata(entity).columns.map((c) => {
        const name = camelCase(c.databaseName);
        const path = c.propertyPath.split(".");
        const getter = R.path(path);

        return {
            getter,
            name,
            path,
            type: c.type,
            values: c.enum,
        } as MetaField;
    }).reduce((l, r) => {
        return {
            ...l,
            [r.name]: r,
        };
    }, {});

    const configuredFields = fields.reduce((all, x) => {
        const metaField: MetaField | null = R.propOr(null, x.name)(meta);

        return [
            ...all,
            new ConfiguredField(conn, repository, x, metaField),
        ];
    }, []);

    const parsedFields = new ConfiguredFields(repository, configuredFields);

    const ItemType = dsl.type({
        fields: parsedFields.forGraphQLOutput(),
        name: listName + "Item",
    });

    const SortType: GraphQLInputObjectType = dsl.input({
        fields: {
            placeholder: {type: GraphQLString},
        },
        name: listName + "Sort",
    });

    const SearchType: GraphQLInputObjectType = dsl.input({
        fields: parsedFields.forGraphQLInput(),
        name: listName + "Search",
    });

    const RequestType: GraphQLInputObjectType = dsl.input({
        fields: {
            limit: {type: dsl.nonNull(LongType)},
            page: {type: dsl.nonNull(LongType)},
            search: {type: dsl.nonNull(SearchType)},
            sort: {type: SortType},
        },
        name: listName + "Request",
    });

    const ResponseType: GraphQLOutputType = dsl.type({
        fields: {
            currentPage: {type: dsl.nonNull(LongType)},
            fromOffset: {type: dsl.nonNull(LongType)},
            hasMore: {type: dsl.nonNull(GraphQLBoolean)},
            items: {type: new GraphQLList(dsl.nonNull(ItemType))},
            itemsPerPage: {type: dsl.nonNull(LongType)},
            remaining: {type: dsl.nonNull(LongType)},
            toOffset: {type: dsl.nonNull(LongType)},
            total: {type: dsl.nonNull(LongType)},
            totalOfPages: {type: dsl.nonNull(LongType)},
            totalOnPage: {type: dsl.nonNull(LongType)},
            totalUnfiltered: {type: dsl.nonNull(LongType)},
        },
        name: listName,
    });

    const Single = {
        args: {
            id: {type: dsl.nonNull(LongType)},
        },
        type: dsl.nonNull(ItemType),
        async resolve(source: any, args: any, ctx: BaseContext, info: any) {
            if (ctx instanceof AuthenticatedContext) {
                const currentSession = await ctx.session();

                const queryBuilder = repository.createQueryBuilder(itemName)
                    .andWhere("true");

                const rootQuery = preQuery(itemName, queryBuilder, currentSession);

                const item = await rootQuery.andWhere(`${itemName}.id = :id`, {
                    id: args.id,
                }).getOne();

                if (R.isNil(item)) {
                    throw new Error("[ERR17] Not found");
                }

                return item;
            } else {
                throw new Error("[ERR18] Authenticated context needed");
            }
        },
    };

    const All = {
        args: {
            request: {type: RequestType},
        },
        fields: {
            placeholder: {type: GraphQLString},
        },
        async resolve(source: any, args: any, ctx: BaseContext, info: any) {
            if (ctx instanceof AuthenticatedContext) {
                const currentSession = await ctx.session();
                const {request} = args;

                const currentPage = Math.max(request.page, 1);
                const itemsPerPage = Math.max(request.limit, 1);
                const offsetStart = (currentPage - 1) * itemsPerPage;
                const offsetEnd = currentPage * itemsPerPage;

                const queryBuilder = repository.createQueryBuilder(itemName)
                    .andWhere("true");

                const rootQuery = preQuery(itemName, queryBuilder, currentSession);

                const newQuery = rootQuery.clone().andWhere(new Brackets((innerQuery) => {
                    return parsedFields.query(itemName, innerQuery.andWhere("true"), request.search);
                })).offset(offsetStart).limit(itemsPerPage);

                const totalUnfiltered = await rootQuery.clone().getCount();

                const [items, count] = await newQuery
                    .getManyAndCount();

                const totalOfPages = Math.ceil(count / itemsPerPage);

                return {
                    currentPage,
                    fromOffset: offsetStart,
                    hasMore: currentPage < totalOfPages,
                    items,
                    itemsPerPage,
                    remaining: Math.max(0, count - (currentPage * itemsPerPage)),
                    toOffset: offsetEnd,
                    total: count,
                    totalOfPages,
                    totalOnPage: items.length,
                    totalUnfiltered,
                } as IResult<Source>;
            } else {
                throw new Error("[ERR19] Authenticated context needed");
            }
        },
        type: dsl.nonNull(ResponseType),
    } as GraphQLFieldConfig<any, any>;

    return {
        All,
        ItemType,
        RequestType,
        ResponseType,
        Single,
        SortType,
    };
};
