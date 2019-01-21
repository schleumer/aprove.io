import DataLoader from "dataloader";

import * as entity from "@/entity";
import { BaseContext } from "@/graphql/shared/context";

export const instance = (ctx: BaseContext) => {
    return new DataLoader(async (ids: number[]) => {
        return await entity.Instance.findByIds(ids);
    });
};
