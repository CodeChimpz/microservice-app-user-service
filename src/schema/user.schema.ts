import {dataSource} from "../connectors/db-init.js";
import {SchemaDataTypes} from "knex-db-connector";

export const UserSchema = await dataSource.createSchema('User', {
    id: {
        type: SchemaDataTypes.increments
    },
    name: {
        type: SchemaDataTypes.string
    },
    email: {
        type: SchemaDataTypes.string
    },
    password: {
        type: SchemaDataTypes.string
    },
    account: {
        type: SchemaDataTypes.string
    },
    phone: {
        type: SchemaDataTypes.string
    }
})