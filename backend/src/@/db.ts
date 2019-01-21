import { PluralNamingStrategy } from "@/helpers/typeorm/naming";

import {createConnection, getConnectionOptions} from "typeorm";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const conn = async (tries = 1) => {
    if (tries > 30) {
        throw new Error("tried a lot");
    }

    try {
        const options = await getConnectionOptions();

        Object.assign(options, { namingStrategy: new PluralNamingStrategy() });

        const connection = await createConnection(options);

        const x = await connection.query("SELECT 1");

        console.log(x);

        return connection;
    } catch (err) {
        console.log(`[${tries}] Trying reconnection, because of ${err.message}`)
        await delay(1000);
        return conn(tries + 1);
    }
};

export default conn();
