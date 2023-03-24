import Joi from 'joi'

export const credentials_valid = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,8}$/),
})

export const uer_data_valid = Joi.object({
    phone: Joi.string(),
    card: Joi.object(),
    address: Joi.object(),
    token: Joi.string().base64()
})