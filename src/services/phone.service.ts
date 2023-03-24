import {logger} from "../init/logger.js";
import {UserService, userService} from "./user.service.js";

export class PhoneService {
    users: UserService

    constructor(userService: UserService) {
        this.users = userService
    }

    async provide(id: number, data: any) {
        //send some data to phone validation api
        logger.app.debug('Phone check init')
        return {}
    }

    async check(id: number, data: any) {
        //validate data from client after phone validation api sent a code to the user
        logger.app.debug('Phone check')
        await this.users.fill(id, {phone: data.phone})
        return {data: phone}
    }
}

export const phone = new PhoneService(userService)