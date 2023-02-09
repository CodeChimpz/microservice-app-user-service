import express, {json} from 'express'
import {endpointObject, router} from "./router.js";

export const app = express()
//middleware
app.use(json())
//router
app.use(router)


