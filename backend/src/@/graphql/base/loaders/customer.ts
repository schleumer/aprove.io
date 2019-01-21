import DataLoader from 'dataloader';

import * as entity from "@/entity";
import { BaseContext } from '@/graphql/shared/context';

import { In } from "typeorm";

export const customer = (ctx: BaseContext) => {
    return new DataLoader(async (ids: number[]) => {
        return await entity.Customer.findByIds(ids);
    });
}

export const customerPhones = (ctx: BaseContext) => {
    return new DataLoader(async (ids: number[]) => {
        return entity.CustomerPhone.find({
            where: {
                customerId: In(ids)
            },
            order: {
                position: 'ASC'
            }
        }).then(res => {
            return ids.map(id => res.filter(_ => _.customerId === id))
        });
    });
}

export const firstCustomerPhone = (ctx: BaseContext) => {
    return new DataLoader(async (ids: number[]) => {
        return entity.CustomerPhone.find({
            where: {
                customerId: In(ids),
                position: 1
            }
        }).then(res => {
            return ids.map(id => res.find(_ => _.customerId === id) || null)
        });
    })
};

export const customerEmails = (ctx: BaseContext) => {
    return new DataLoader(async (ids: number[]) => {
        return entity.CustomerEmail.find({
            where: {
                customerId: In(ids)
            },
            order: {
                position: 'ASC'
            }
        }).then(res => {
            return ids.map(id => res.filter(_ => _.customerId === id))
        });
    });
}

export const firstCustomerEmail = (ctx: BaseContext) => {
    return new DataLoader(async (ids: number[]) => {
        return entity.CustomerEmail.find({
            where: {
                customerId: In(ids),
                position: 1
            }
        }).then(res => {
            return ids.map(id => res.find(_ => _.customerId === id) || null)
        });
    })
};
