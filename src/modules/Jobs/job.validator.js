import joi from 'joi'





export const addJobValidator = {
    body: joi.object({
      jobTitle: joi.string().required(),
      jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').required(),
      workingTime: joi.string().valid('part-time', 'full-time').required(),
      seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
      jobDescription: joi.string().required(),
      technicalSkills: joi.array().items(joi.string().required()).required(),
      softSkills: joi.array().items(joi.string().required()).required()

    
    
    })
}

export const updateJobValidator = {
    body: joi.object({
      jobTitle: joi.string(),
      jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid'),
      workingTime: joi.string().valid('part-time', 'full-time'),
      seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
      jobDescription: joi.string().required(),
      technicalSkills: joi.array().items(joi.string().required()),
      softSkills: joi.array().items(joi.string().required())

    
    
    })
}



export const updateJobWithNameValidator = {
    body: joi.object({
      jobTitle: joi.string(),
      jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid'),
      workingTime: joi.string().valid('part-time', 'full-time'),
      seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
      jobDescription: joi.string(),
      technicalSkills: joi.array().items(joi.string().required()),
      softSkills: joi.array().items(joi.string().required())
    }),
    params: joi.object({
        jobName:joi.string().required()
    })

}
