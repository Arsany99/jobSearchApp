import express from 'express'
import jobModel from "../../../db/job.model.js"
import { asyncHandler } from '../../utils/globalErrorHandler.js'
import { AppError } from '../../utils/calssError.js'
import companyModel from '../../../db/company.model.js'
import applicationModel from '../../../db/application.model.js'
import cloudinary from '../../utils/cloudinary.js'

//=============================add job==================================//
export const addjob =asyncHandler( async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, softSkills,technicalSkills } = req.body
    const job = await jobModel.create({ jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, softSkills,technicalSkills , addedBy: req.userInfo.id })
    res.status(200).json({ msg: 'done', job })
})




//==============================update job======================//
export const updatejob = asyncHandler( async (req, res,next)=>{
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, softSkills,technicalSkills } = req.body
    const job = await jobModel.findOneAndUpdate({addedBy:req.userInfo.id},{jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, softSkills,technicalSkills},{new:true})
    if (!job) {
        return next(new AppError("job not found or you are not authorized", 400))        
    }
    res.status(200).json({msg:'done' ,job})
})

//================================another update job by name and hr id=====================//
export const updatejobByName = asyncHandler( async (req, res,next)=>{
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, softSkills,technicalSkills } = req.body
    const {jobName} = req.params
    const job = await jobModel.findOneAndUpdate({addedBy:req.userInfo.id ,jobTitle:jobName },{jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, softSkills,technicalSkills},{new:true})
    if (!job) {
        return next(new AppError("job not found or you are not authorized", 400))        
    }
    res.status(200).json({msg:'done' ,job})
})


//===========================delete job====================//
export const deleteJob = asyncHandler( async (req, res, next) => {
    const job = await jobModel.findOneAndDelete({addedBy:req.userInfo.id})
    res.status(200).json({ msg: 'done' })
})



//====================delete job by name==================//
export const deleteJobByName = asyncHandler( async (req, res, next) => {
    const {jobName} = req.params
    const job = await jobModel.findOneAndDelete({addedBy:req.userInfo.id , jobTitle:jobName})
    if (!job) {
        return next(new AppError("job not found or you are not authorized", 400))        
    }
    res.status(200).json({ msg: 'done' })
})


//===================get all job with his company info===========================//

export const getAllJobsWithCompanyInfo = asyncHandler(async (req, res, next) => {
      const jobs = await jobModel.find().populate({
        path:'addedBy',
      })
      jobs.map(async(i)=>{
        console.log(i.addedBy._id);
        const company = await companyModel.find({companyHr:i.addedBy._id})
        res.status(200).json({ msg: 'Success', jobs , company});

      })
  
  })

//======================Get all Jobs for a specific company=================//
export const getJobForcompanies = async (req, res, next) => {
    const {companyName}= req.query

    const company = await companyModel.findOne({companyName})
    const jobs = await jobModel.find({addedBy:company.companyHr})
    console.log(company.companyHr);
    
    res.status(200).json({ msg: 'done', company , jobs })
}


//============================filter job all condition match the job====================//
export const getFilterJobs = async (req, res, next) => {
    const {jobLocation ,seniorityLevel ,workingTime,technicalSkills,jobTitle}= req.body

    const filter = {};
    if (workingTime) filter.workingTime = workingTime;
    if (jobLocation) filter.jobLocation = jobLocation;
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
    if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: 'i' }; // Case-insensitive search for jobTitle
    if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(',') }; // Assuming technicalSkills is an array field

    // Fetch jobs based on the constructed filter
    const jobs = await jobModel.find(filter);

    // Return the response with the filtered jobs
    res.status(200).json({ msg: 'done', jobs })
    
}

//======================filter job for any condition from user===================//
export const getAnyFilterJobs = async (req, res, next) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    // Build filter object based on provided criteria
    const filter = {
        $or: [] // Initialize an array for $or conditions
    };

    if (workingTime) filter.$or.push({ workingTime });
    if (jobLocation) filter.$or.push({ jobLocation });
    if (seniorityLevel) filter.$or.push({ seniorityLevel });
    if (jobTitle) filter.$or.push({ jobTitle: { $regex: jobTitle, $options: 'i' } });
    if (technicalSkills) {
        const skillsArray = technicalSkills.split(',').map(skill => skill.trim());
        filter.$or.push({ technicalSkills: { $in: skillsArray } });
    }

    // If no conditions were provided, return all jobs
    if (filter.$or.length === 0) {
        const allJobs = await jobModel.find();
        return res.status(200).json({ msg: 'All jobs', jobs: allJobs });
    }

    // Fetch jobs based on the constructed filter
    const jobs = await jobModel.find({ $or: filter.$or });

    // Return the response with the filtered jobs
    res.status(200).json({ msg: 'done', jobs });
    
}

//=======================================///


export const applyToJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.userInfo.id; // Assuming user info is in req.user after authentication
        const { userTechSkills, userSoftSkills, userResume } = req.body;

        // Check if the job exists
        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Create a new application document
        const newApplication = new applicationModel({
            jobId,
            userId,
            userTechSkills,
            userSoftSkills,
            userResume
        });

        // Save the application to the database
        await newApplication.save();

        res.status(201).json({ msg: 'Application submitted successfully', application: newApplication });
    } catch (error) {
        console.error('Error applying to job:', error);
        res.status(500).json({ msg: 'Error applying to job', error });
    }
};


//========================another aoi to apply====================//
export const anotherapplyToJob = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.userInfo.id; // Assuming user info is in req.user after authentication
    const { userTechSkills, userSoftSkills } = req.body;

    if (!req.file) {
        return res.status(400).json({ msg: 'Resume file is required' });
    }

    // Upload the resume to Cloudinary
    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload(req.file.path, { resource_type: "raw" });
    } catch (error) {
        return res.status(500).json({ msg: 'Error uploading resume', error });
    }

    const userResume = uploadResult.secure_url;

    // Check if the job exists
    const job = await jobModel.findById(jobId);
    if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
    }

    // Create a new application document
    const newApplication = await applicationModel.create({
        jobId,
        userId,
        userTechSkills,
        userSoftSkills,
        userResume
    });

    res.status(201).json({ msg: 'Application submitted successfully', application: newApplication });
});