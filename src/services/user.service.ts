import {dataSource} from "../connectors/db-init.js";
import {DataSource, Repository} from "knex-db-connector";
import {UserSchema} from "../schema/user.schema.js";
console.log(UserSchema)
export class UserService {
    repo: Repository

    constructor(repo: any) {
        this.repo = repo
    }

    async get(id: string) {
        return await this.repo.find({
            where: (builder) => {
                builder.where('id', id)
                return builder
            }
        })
    }

    async create(user: any) {
        console.log(user)
        return await this.repo.create(user)
    }
}

export const userService = new UserService(await dataSource.getRepo('User'))