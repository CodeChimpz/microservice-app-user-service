import {LoggerService} from "mein-winston-logger";
import {UserService, userService} from "../services/user.service.js";
import {Request, Response} from "express";
import {logger} from "../connectors/logger-init.js";

class UserController {
    logger: LoggerService
    userService: UserService

    constructor(logger: LoggerService, userService: any) {
        this.logger = logger
        this.userService = userService
    }

    get = async (req: Request, res: Response) => {
        try {
            const {_id} = req.body.data
            const userdata = await this.userService.get(_id)
            if (!userdata) {
                return res.status(401).json({data: null, message: "No such user found"})
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
            const user = {...req.body.data}
            const data = await this.userService.create(user)
            res.status(200).json({data: data, message: "Registered successfully", to_cache: data})
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: e.message})
        }
    }
}

export const userController = new UserController(logger, userService)