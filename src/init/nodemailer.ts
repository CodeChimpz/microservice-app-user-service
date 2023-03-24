import nodemailer from 'nodemailer'
import {config} from "dotenv";

config()
export const nodemailerTransport = process.env.NODE_ENV !== 'production' ? await nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: String(process.env.ETHEREAL_USERNAME),
        pass: String(process.env.ETHEREAL_PASS)
    }
}) : await nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: String(process.env.ETHEREAL_USERNAME),
        pass: String(process.env.ETHEREAL_PASS)
    }
})


