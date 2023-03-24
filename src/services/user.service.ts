import {DataSource, Repository} from "knex-db-connector";
import {IUser, userRepo} from "../schema/user.schema.js";
import {query} from "express";

export class UserService {
    repo: Repository<IUser>
    checkpoints: string[]

    constructor(repo: any, checkpoints: string[]) {
        this.repo = repo
        this.checkpoints = checkpoints
    }

    async get(id: number) {
        return this.repo.findOneBy(query =>
            query.where({_id: id})
        )
    }

    async getAll() {
        return this.repo.find({})
    }

    //check if email already assigned to user
    async getEmail(email: string) {
        //
        const user = await this.repo.find({ where: query => query.where({email: email})})
        return user[0]
    }

    //initialize user creation for the email-password pair provided
    async create(email: string, password: string) {
        const user = await this.repo.create({
            email: email,
            password: password
        })
        return user._id
    }

    //fil user instance with data
    async fill(id: number, data: any) {
        return this.repo.edit(data, (query) => query.where({_id: id}))
    }

    //get unfilled data fields on user instance
    async getEmpty(id: number) {
        const user = await this.repo.findOneBy(query => query.where({_id: id}))
        return Object.entries(user).filter(prop => this.checkpoints.includes(prop[0]) && !prop[1]).map(prop => prop[0])
    }

    //check if user can be confirmed - all data is filled
    async finish(id: number,) {
        //check if all data is filled
        const empty_ = await this.getEmpty(id)
        if (empty_.length) {
            return false
        }
        return this.repo.edit({confirmed: true, registeredAt_: new Date()}, query => query.where({_id: id}))
    }

    //purge user data from previous attempts
    async clear(id: number) {
        return this.repo.edit({
            address: undefined,
            phone: undefined,
            wallet: undefined
        }, (query) => query.where({_id: id}))
    }

    async deleteTotal(id: number) {
        return this.repo.delete((query) => query.where({_id: id}))
    }
}
//todo: Checkpoint class
export const userService = new UserService(userRepo, ['email','email-check','address','wallet','phone','phone-check'])