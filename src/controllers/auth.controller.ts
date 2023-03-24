import {Request, Response} from "express";
import {WinstonLoggerService} from "mein-winston-logger";
import {userService, UserService} from "../services/user.service.js";
import {logger} from "../init/logger.js";
import bcrypt from 'bcrypt'
import {walletCoordinator} from "../services/wallet.coordinator.service.js";
import {emailService} from "../services/mail.service.js";
import {phone} from "../services/phone.service.js";
import {address} from "../services/address.service.js";
import jwt from 'jsonwebtoken'
import {config} from "dotenv";

type TCheckpoint = {
    name: string,
    handler: (...args: any[]) => Promise<{ result?: any, error?: string }>
}
type TCheckpointObj = {
    [key: string]: number
}
config()

export class AuthController {
    checkpointsObj: TCheckpointObj = {}
    checkpointsOrder: TCheckpoint[]
    logger: WinstonLoggerService
    //services
    users: UserService

    constructor(checkpoints: TCheckpoint[], userService: UserService) {
        //check if checkpoints don't have repeating values
        this.logger = logger
        this.checkpointsOrder = checkpoints.filter(check => {
            this.logger.app.info('Registered checkpoint on auth', check)
            if (!this.checkpointsObj[check.name]) {
                this.checkpointsObj[check.name] = 1
                return true
            }
            return false
        })
        this.users = userService
    }

    //start registration process
    async start(req: Request, res: Response) {
        try {
            const {email, password: password} = req.body.data
            //check email
            const check = await this.users.getEmail(email)
            if (check) {
                res.status(400).json({message: 'Email already registered'})
                return
            }
            //encrypt pw
            const pw_encrypted = await bcrypt.hash(password, 10)
            const id = await this.users.create(email, pw_encrypted)
            res.status(200).json({message: '', data: {id, next: this.checkpointsOrder[0].name}})
        } catch (e: any) {
            //?
            this.logger.app.error(e)
            res.status(500).json({message: 'Server error'})
        }
    }

    //send data to a specific checkpoint
    async proceed(req: Request, res: Response) {
        try {
            const {id, data, checkpoint} = req.body
            //handle checkpoint
            const check_ind = this.checkpointsOrder.findIndex(c => c.name === checkpoint)
            if (check_ind < 0) {
                res.status(400).json({message: 'Invalid checkpoint'})
                return
            }
            const done = await this.checkpointsOrder[check_ind].handler(id, data)
            if (done.error) {
                res.status(200).json({message: '', data: {id, error: done.error}})
                return
            }
            //send next checkpoint
            const next = check_ind + 1 >= this.checkpointsOrder.length ? 'final' : this.checkpointsOrder[check_ind + 1].name
            res.status(200).json({message: '', data: {id, result: done.result, next}})
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: 'Server error'})
        }
    }

    //approve registration
    async finish(req: Request, res: Response) {
        try {
            const {id} = req.body
            //validate user creation
            const finished_ = await this.users.finish(id)
            if (!finished_) {
                //send array of unfilled parameters for the client to fill in any order the client desires
                const to_fill = await this.users.getEmpty(id)
                res.status(400).json({message: 'User hasn\'t passed all checkpoints', data: {id, to_fill}})
                return
            }
            res.status(200).json({message: 'Successfully registered', data: {id}})
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: 'Server error'})
        }
    }

    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body.data
            const user = await this.users.getEmail(email)
            if(!user){
                res.status(400).json({message: "Wrong email or password"})
                return
            }
            const pass_check = await bcrypt.compare(password, user.password)
            if (!pass_check) {
                res.status(400).json({message: "Wrong email or password"})
                return
            }
            //sign jwt
            const token = jwt.sign({
                _id: user._id,
                role: 'USER'
            }, String(process.env.JWT_SECRET))
            res.status(200).json({message: 'Successfully logged in! ', token})
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: 'Server error'})
        }
    }


}

const checkpoints = [
    //verify email
    {
        name: 'email',
        handler: emailService.provide.bind(emailService)
    },
    {
        name: 'email-check',
        handler: emailService.check.bind(emailService)
    },
    //verify phone number
    {
        name: 'phone',
        handler: phone.provide.bind(phone)
    }, {
        name: 'phone-check',
        handler: phone.check.bind(phone)
    },
    {
        name: 'address',
        handler: address.provide.bind(address)
    },
    //create a wallet on wallet service based on card details
    {
        name: 'wallet',
        handler: walletCoordinator.create.bind(walletCoordinator)
    }]

export const authController = new AuthController(checkpoints, userService)