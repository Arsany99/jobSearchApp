import mongoose from 'mongoose'


const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
      },
      jobLocation: {
        type: String,
        enum: ['onsite', 'remotely', 'hybrid'],
        required: true
      },
      workingTime: {
        type: String,
        enum: ['part-time', 'full-time'],
        required: true
      },
      seniorityLevel: {
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
        required: true
      },
      jobDescription: {
        type: String,
        required: true
      },
      technicalSkills: {
        type: [String],
        required: true
      },
      softSkills: {
        type: [String],
        required: true
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      companyHr:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
      }
    
} , {
    versionKey: false ,
    timestamps: true
})


const jobModel = mongoose.model('job', jobSchema)


export default jobModel