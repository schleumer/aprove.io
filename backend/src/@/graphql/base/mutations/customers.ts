import {GraphQLBoolean, GraphQLInputObjectType, GraphQLString} from "graphql";

import LongType from '@/graphql/shared/scalars/long';
import {Search as CustomersSearch} from '@/graphql/base/queries/customers';
import {Customer, CustomerPhone, CustomerEmail} from "@/entity";
import {nonNull} from "@/helpers/graphql/dsl";
import auth from '@/helpers/auth'

import ajv from '@/helpers/ajv'

import {
    CustomerType,
    CustomerStatus,
    CustomerEmail as CustomerEmailType,
    CustomerPhone as CustomerPhoneType
} from "@/graphql/shared/types/customer";

const UpdateCustomerInput = new GraphQLInputObjectType({
    name: 'UpdateCustomerInput',
    fields: {
        id: {type: nonNull(LongType)},
        type: {type: nonNull(CustomerType)},
        status: {type: nonNull(CustomerStatus)},
        name: {type: nonNull(GraphQLString)},

        document: {type: GraphQLString},
        streetName: {type: GraphQLString},
        streetNumber: {type: GraphQLString},
        complementary: {type: GraphQLString},
        neighborhood: {type: GraphQLString},
        city: {type: GraphQLString},
        zipcode: {type: GraphQLString},
        state: {type: GraphQLString},
    }
})

const CreateCustomerPhoneInput = new GraphQLInputObjectType({
    name: 'CreateCustomerPhoneInput',
    fields: {
        phone: {type: nonNull(GraphQLString)},
    }
})

const createCustomerPhoneSchema = ajv.compile({
    $async: true,
    properties: {
        phone: {
            type: 'string',
            pattern: '[0-9\\*]+'
        }
    }
})

const CreateCustomerEmailInput = new GraphQLInputObjectType({
    name: 'CreateCustomerEmailInput',
    fields: {
        email: {type: nonNull(GraphQLString)},
    }
})

const createCustomerEmailSchema = ajv.compile({
    $async: true,
    properties: {
        email: {
            type: 'string',
            format: 'email'
        }
    }
})

export default async () => {
    const CustomersSearchType = await CustomersSearch()
    const qb = Customer.getRepository().createQueryBuilder()
    const phonesQb = CustomerPhone.getRepository().createQueryBuilder()
    const emailsQb = CustomerEmail.getRepository().createQueryBuilder()

    const getCustomer = async (instanceId: number, id: number): Promise<Customer> => await qb
        .select()
        .where('id = :id AND instance_id = :instance', {id, instance: instanceId})
        .getOne()

    return {
        createCustomerPhone: auth({
            type: CustomerPhoneType,
            args: {
                customerId: {type: nonNull(LongType)},
                input: {type: CreateCustomerPhoneInput}
            },
            async resolve(source, args, ctx, info) {
                const { instance } = await ctx.session()
                const customer = await getCustomer(instance.id, args.customerId)

                const { phone } = await createCustomerPhoneSchema(args.input)

                return await CustomerPhone.create({
                    phone,
                    customer
                }).save()
            }
        }),
        createCustomerEmail: auth({
            type: CustomerEmailType,
            args: {
                customerId: {type: nonNull(LongType)},
                input: {type: CreateCustomerEmailInput}
            },
            async resolve(source, args, ctx, info) {
                const { instance } = await ctx.session()

                const customer = await getCustomer(instance.id, args.customerId)

                const { email } = await createCustomerEmailSchema(args.input)

                return await CustomerEmail.create({
                    email,
                    customer
                }).save()
            }
        }),
        removeCustomerPhone: auth({
            type: GraphQLBoolean,
            args: {
                customerId: {type: LongType},
                customerPhoneId: {type: LongType}
            },
            async resolve(source, args, ctx, info) {
                const { instance } = await ctx.session()

                const customer = await qb
                    .select()
                    .where('id = :id AND instance_id = :instance', {id: args.customerId, instance: instance.id})
                    .getOne()

                if (customer === undefined) {
                    throw new Error("[ERR8] Not found")
                }

                await phonesQb
                    .delete()
                    .where('id = :id', {id: args.customerPhoneId, customerId: customer.id})
                    .execute()

                return true
            }
        }),
        removeCustomerEmail: auth({
            type: GraphQLBoolean,
            args: {
                customerId: {type: LongType},
                customerEmailId: {type: LongType}
            },
            async resolve(source, args, ctx, info) {
                const { instance } = await ctx.session()

                const customer = await qb
                    .select()
                    .where('id = :id AND instance_id = :instance', {id: args.customerId, instance: instance.id})
                    .getOne()

                if (customer === undefined) {
                    throw new Error("[ERR9] Not found")
                }

                await emailsQb
                    .delete()
                    .where('id = :id', {id: args.customerEmailId, customerId: customer.id})
                    .execute()

                return true
            }
        }),
        updateCustomer: auth({
            type: CustomersSearchType.ItemType,
            args: {
                input: {type: UpdateCustomerInput}
            },
            async resolve(source, args, ctx, info) {
                const { instance } = await ctx.session()

                const input = args.input

                await qb
                    .update()
                    .set({...input, updatedAt: new Date})
                    .where('id = :id AND instance_id = :instance', {id: input.id, instance: instance.id})
                    .execute()

                return await Customer.findOne(input.id)
            }
        })
    }
}
