import {NextFunction, Request, Response} from "express";
import Joi from "joi";


export function validatorFactory(schema: Joi.Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body.data
        const {error} = schema.validate(data)
        if (error) {
            next(error.details[0].message)
            return
        }
        next()
        return;
    }
}