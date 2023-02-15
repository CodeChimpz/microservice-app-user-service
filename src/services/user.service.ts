import {dataSource} from "../connectors/db-init.js";
import {DataSource, Repository} from "knex-db-connector";
import {UserRepo} from "../schema/user.schema.js";

export class UserService {
    repo: Repository

    constructor(repo: any) {
        this.repo = repo
    }

    async get(id: string) {
        console.log(id)
        return await this.repo.find({
            where: (builder) => {
                builder.where('_id', id)
                return builder
            }
        })
    }

    async create(user: any) {
        // const user = new UserSchema()
        return this.repo.create(user)
    }
}

export const userService = new UserService(UserRepo)