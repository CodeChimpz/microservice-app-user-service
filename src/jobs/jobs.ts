import {userService} from "../services/user.service.js";
import {config} from "dotenv";
import {raw} from "express";
import {TJob} from "./scheduler.js";

const SAVE_USER_DATA_FOR: number = Number(process.env.SAVE_USER_DATA_FOR) || 0
const UPDATE_DATA_RETENTION = Number(process.env.UPDATE_DATA_RETENTION)
export const jobs: TJob[] = [
    {
        //check if specified time for data retention has passed and delete user data
        name: 'Data_retention_check',
        period: {
            hour: 1
        },
        action: async () => {
            const users = await userService.getAll()
            users.map(async (user) => {
                const now_ = new Date()
                //if time passed - delete user data
                if (user.registeredAt_ && now_.getFullYear() - user.registeredAt_.getFullYear() > SAVE_USER_DATA_FOR) {
                    await userService.deleteTotal(user._id)
                }
            })
        }
    }
]