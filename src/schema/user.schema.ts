import {dataSource} from "../init/db.js";
import {SchemaDataTypes} from 'knex-db-connector';

export const userRepo = await dataSource.createSchema('User', {
    email: {
        type: SchemaDataTypes.string,
        nonNull: true
    },
    password: {
        type: SchemaDataTypes.string,
        nonNull: true
    },
    name: {
        type: SchemaDataTypes.string
    },
    phone: {
        type: SchemaDataTypes.string
    },
    //reference to wallet
    wallet: {
        type: SchemaDataTypes.integer
    },
    //Address data
    address: {
        type: SchemaDataTypes.json,
    },
    //temporary data for verififcation
    temp_: {
        type: SchemaDataTypes.string
    },
    confirmed: {
        type: SchemaDataTypes.boolean,
        default: false
    },
    registeredAt_: {
        type: SchemaDataTypes.datetime
    }
}, true)

export interface IUser {
    email: string,
    password: string,
    wallet: string,
    phone: string,
    address: string,
    temp_: string
    confirmed: boolean,
    registeredAt_?: Date
}

//checkpoint names
