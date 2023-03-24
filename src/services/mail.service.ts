import {logger} from "../init/logger.js";
import {Transporter} from "nodemailer";
import {nodemailerTransport} from "../init/nodemailer.js";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import {userService, UserService} from "./user.service";
import {config} from "dotenv";

config()

export class EmailService {
    transport: Transporter
    mail_data: {
        from: string
    }
    user: UserService

    constructor(transport: Transporter, userService: UserService, options: {
        from: string
    }) {
        this.transport = transport
        this.mail_data = options
        this.user = userService
    }

    async provide(id: number, data: any) {
        //todo: a Decorator mb
        //check if temp_ is not occupied
        const usr = await this.user.get(id)
        if (!usr) {
            return {error: 'User not found'}
        }
        const email = usr.email
        const user = await this.user.get(id)
        if (user.temp_) {
            return {error: 'Another checkpoint already engaged'}
        }
        //generate token and send to a mf
        const token = crypto.randomBytes(64).toString('hex')
        const text = 'Verify email! That\'s your token here:\n' + token
        //save it to db
        await this.user.fill(id, {temp_: token})
        await this.transport.sendMail({
            from: this.mail_data.from,
            to: email,
            text: text,
        })
        return {result: true}
    }

    async check(id: number, data: any) {
        const usr = await this.user.get(id)
        if (!usr) {
            return {error: 'User not found'}
        }
        const email = usr.email
        const from_db = usr.temp_
        if (data.token !== from_db) {
            return {error: 'Invalid token'}
        }
        //fill user data and delete temp
        await this.user.fill(id, {email: email, temp_: null})
        return {result: email}
    }
}

export const emailService = new EmailService(nodemailerTransport, userService, {
    from: String(process.env.EMAIL_SENDER)
})