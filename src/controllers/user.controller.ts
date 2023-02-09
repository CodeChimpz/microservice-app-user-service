import {LoggerService} from "mein-winston-logger";
import {UserService, userService} from "../services/user.service.js";
import {Request, Response} from "express";
import {logger} from "../connectors/logger-init";

class UserController {
    logger: LoggerService
    userService: UserService

    constructor(logger: LoggerService, userService: any) {
        this.logger = logger
        this.userService = userService
    }

    get = async (req: Request, res: Response) => {
        try {
            const {id} = req.body
            const userdata = await this.userService.get(id)
            if (!userdata) {
                return res.status(401).json({message: "No such user found"})
            }
            res.status(200).json({data: userdata, message: "Retrieved successfully"})
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: e.message})
        }
    }
    //test only
    create = async (req: Request, res: Response) => {
        try {
            const user = {...req.body}
            const data = await this.userService.create(user)
            res.status(200).json({data: data, message: "Registered successfully"})
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: e.message})
        }
    }
}

export const userController = new UserController(logger, userService)