import {userService, UserService} from "../services/user.service.js";
import {wallet, WalletRemoteService} from "../services/wallet.remote.service.js";

export class WalletCoordinator {
    userService: UserService
    walletService: WalletRemoteService

    constructor(userService: UserService, walletService: WalletRemoteService) {
        this.walletService = walletService
        this.userService = userService
    }

    async create(id: number, data: any) {
        //add wallet on wallet service
        const remote = await this.walletService.create(id, data)
        if (!remote.success) {
            return {error: 'Error on Wallet creation' + remote.error}
        }
        //add wallet data on user instance
        await this.userService.fill(id, {wallet: remote.data[0].data.id})
        return {result: true}
    }
}

export const walletCoordinator = new WalletCoordinator(userService, wallet)