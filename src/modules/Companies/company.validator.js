import joi from 'joi'



export const addCompanyVaildator = {
    body: joi.object({
        companyName: joi.string().required(),
        description: joi.string().required(),
        industry: joi.string().required(),
        companyEmail: joi.string().email().required(),
        address: joi.string().required(),
        numberOfEmployees: joi.string().valid('1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001+').required()
      })
}


export const updateCompanyVaildator = {
    body: joi.object({
        companyName: joi.string(),
        description: joi.string(),
        industry: joi.string(),
        companyEmail: joi.string().email(),
        address: joi.string(),
        numberOfEmployees: joi.string().valid('1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001+')
      })
}
