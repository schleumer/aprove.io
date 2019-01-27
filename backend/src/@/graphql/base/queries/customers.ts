import * as types from "@/graphql/shared/types/customer";
import InstanceType from "@/graphql/shared/types/instance";
import {search, sf, sfOutput} from "@/helpers/search";

import {Customer} from "@/entity/customer";
import { AuthenticatedContext } from "@/graphql/shared/context";
import auth from "@/helpers/auth";
import {listOf} from "@/helpers/graphql/dsl";
import {memoAsync} from "@/helpers/prelude";

export const Search = memoAsync(async () => {
    return await search("Customer", "Customers", Customer, [
        sf("id", true),
        sf("code", true),
        sf("type", true),
        sf("status", true),
        sf("name", true),
        sf("notes", true),

        sf("document", true),

        sf("streetName", true),
        sf("streetNumber", true),
        sf("complementary", true),
        sf("neighborhood", true),
        sf("city", true),
        sf("zipcode", true),
        sf("state", true),

        sf("createdAt", true),
        sf("updatedAt", true),
        sf("deletedAt", true),

        sf("userId", true),
        sf("instanceId"),

        sfOutput("instance", InstanceType, async (row: Customer) => {
            return await row.instance;
        }),

        sfOutput("user", InstanceType, async (row: Customer) => {
            return await row.user;
        }),

        sfOutput("phones", listOf(types.CustomerPhone), async (row: Customer, args, context: AuthenticatedContext) => {
            return await context.loader("customerPhones").load(row.id);
        }),

        sfOutput("emails", listOf(types.CustomerEmail), async (row: Customer, args, context: AuthenticatedContext) => {
            return await context.loader("customerEmails").load(row.id);
        }),

        sfOutput("phone", types.CustomerPhone, async (row: Customer, args, context: AuthenticatedContext) => {
            return await context.loader("firstCustomerPhone").load(row.id);
        }),

        sfOutput("email", types.CustomerEmail, async (row: Customer, args, context: AuthenticatedContext) => {
            return await context.loader("firstCustomerEmail").load(row.id);
        }),
    ], (t, q, s) => {
        return q
            .leftJoinAndSelect(`${t}.instance`, "instance")
            .leftJoinAndSelect(`${t}.user`, "user")
            .andWhere(`${t}.instanceId = :instanceId`, {instanceId: s.instance.id})
            .orderBy(`${t}.updatedAt`, "DESC", "NULLS LAST");
    });
});

export default async () => {
    const customersSearch = await Search();

    return {
        customers: auth(customersSearch.All),
        customer: auth(customersSearch.Single),
    };
};
