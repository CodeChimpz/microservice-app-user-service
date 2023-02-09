import {Response, Request, Router} from "express";
import {userController} from "./controllers/user.controller.js";
import {logger} from "./connectors/logger-init";

export const router = Router()
//todo: Unite with endpoint for gateway declaration somehow
export const endpointObject = {
    '/user/get': userController.get,
    '/user/post': userController.create
}
//all the routes as mounted
Object.entries(endpointObject).forEach(endpoint => {
    const [path, controller] = endpoint
    logger.app.info('Registered endpoint : ' + path)
    router.route(path).post(controller.bind(userController))
})

