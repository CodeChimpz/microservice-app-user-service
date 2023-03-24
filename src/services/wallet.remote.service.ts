import {createWallet} from "../transactions.js";
import {TAddress} from "../types/index.js";

type TCardDetails = {
    number: number,
    exp_month: number,
    exp_year: number,
    cvc: number
}


export class WalletRemoteService {
    constructor() {
    }

    async create(user: number, details: { email?: string, name?: string, phone?: string, card: TCardDetails, address: TAddress }) {
        return createWallet({user,details})
    }
}

export const wallet = new WalletRemoteService()