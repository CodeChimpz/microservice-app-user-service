import {committer} from "./init/registry.js";
import {config} from "dotenv";

config()
const {
    WALLET_SERVICE_KEY,
    WALLET_SERVICE_NAME,
} = process.env

export const createWallet = async (walletData: any) =>
    committer.twoPCommit([
        {
            endpoint: {
                endpoint: '/transactions/wallet-create',
                name: String(WALLET_SERVICE_NAME),
                auth: String(WALLET_SERVICE_KEY)
            },
            data: walletData
        }
    ])