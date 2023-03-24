import {Response, Request, Router, NextFunction} from "express";
import {logger} from "./init/logger.js";
import {registerEndpoint} from "mein-endpoint-registrator";
import {authController} from "./controllers/auth.controller.js";
import {validatorFactory} from "./validation/validation.middleware.js";
import {credentials_valid, uer_data_valid} from "./validation/validation.user.js";

export const router = Router()
//todo: Unite with endpoint for gateway declaration somehow
export const endpointObject = {
    '/auth/start': {controller: authController.start, mw: [validatorFactory(credentials_valid)]},
    '/auth/proceed': {controller: authController.proceed, mw: [validatorFactory(uer_data_valid)]},
    '/auth/finish': {controller: authController.finish, mw: []},
    '/auth/login': {controller: authController.login, mw: [validatorFactory(credentials_valid)]}
}
registerEndpoint<(req: Request, res: Response) => Promise<void>, (req: Request, res: Response, next: NextFunction) => Promise<void>>(router, endpointObject, authController, {
    cache: true,
    logger: logger
})

