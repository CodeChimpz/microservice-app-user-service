import {userService, UserService} from "./user.service.js";
import {logger} from "../init/logger.js";
import {PhoneService} from "./phone.service";

export class AddressService {
    users: UserService

    constructor(userService: UserService) {
        this.users = userService
    }

    async provide(id: number, data: any) {
        logger.app.debug('Address check')
        await this.users.fill(id, {address: JSON.stringify(data.address)})
        return {}
    }

}

export const address = new AddressService(userService)