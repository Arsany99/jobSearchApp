import joi from 'joi'

export const signUpVaildator = {
    body: joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        recoveryEmail: joi.string().email().optional(),
        DOB: joi.date().iso().required(),
        mobileNumber: joi.string().pattern(/^[0-9]{10,15}$/).required(),
        role: joi.string().valid('User', 'Company_HR').default('User'),
        status: joi.string().valid('online', 'offline').default('offline')
      })
}


export const signInVaildator = {
    body: joi.object({
        identifer: joi.string().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
      })
}


export const updatePassword = {
    body: joi.object({
        otp : joi.string().optional(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
      })
}



