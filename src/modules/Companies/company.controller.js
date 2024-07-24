import express from 'express'
import companyModel from '../../../db/company.model.js'
import { AppError } from '../../utils/calssError.js'
import { asyncHandler } from '../../utils/globalErrorHandler.js'
import jobModel from '../../../db/job.model.js'
import applicationModel from '../../../db/application.model.js'




export const getcompanies = async (req, res, next) => {
    const companies = await companyModel.find()
    res.status(200).json({ msg: 'done', companies })
}



//==================Add Company================//
export const addcompany =asyncHandler( async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body
    const companyExist = await companyModel.findOne({companyEmail , companyName})

    if (companyExist) {
        return next(new AppError('the company already exist', 409))
    }
    const company = await companyModel.create({ companyName, description, industry, address, numberOfEmployees, companyEmail, companyHr: req.userInfo.id })
    res.status(200).json({ msg: 'done', company })
})


//==================update company===============//
export const updateCompany = asyncHandler( async (req, res,next)=>{
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body
    const emailExist = await companyModel.findOne({ companyEmail })
    const companyNameExist = await companyModel.findOne({ companyName })
    if (emailExist || companyNameExist) {
        return next(new AppError("dublicated email or Name", 400))
    }
    const company = await companyModel.findOneAndUpdate({companyHr:req.userInfo.id},{ companyName, description, industry, address, numberOfEmployees, companyEmail },{new:true})
    if (!company) {
        return next(new AppError("company not found or you are not authorized", 400))        
    }
    res.status(200).json({msg:'done' ,company})
})


//======================delete company=======================//
export const deleteCompany = asyncHandler( async (req, res, next) => {
    const company = await companyModel.findOneAndDelete({companyHr:req.userInfo.id})
    res.status(200).json({ msg: 'done' })
})



//====================get company data=================//
export const getcompanyData =asyncHandler( async (req, res, next) => {
    const{id}= req.params
    const Company = await companyModel.findOne({_id:id ,companyHr:req.userInfo.id })
    const jobs = await jobModel.find({ addedBy: Company.companyHr })

    res.status(200).json({ msg: 'done', Company ,jobs })
})


//======================get company data with name============================//
export const getcompanyDataWithName =asyncHandler( async (req, res, next) => {
    const {companyName}= req.body
    const Company = await companyModel.findOne({companyName})
    res.status(200).json({ msg: 'done', Company })
})



//=======================================================//
export const getApplication =asyncHandler( async (req, res) => {
        const jobId = req.params.jobId;
        const userId = req.userInfo.id; 
        const application = await applicationModel.find({jobId }).populate({
            path:'userId',
            select: '-_id'
        })

         res.status(200).json({ msg: 'done', application })


});


//===========================another api to get application=======================//
export const getanotherApplication =asyncHandler( async (req, res) => {
    const {jobTitle} = req.body
    const jobs = await jobModel.findOne({jobTitle })
    const userId = req.userInfo.id; 
    //console.log(jobs._id);
    const jobId = jobs._id
    const application = await applicationModel.find({jobId }).populate({
        path:'userId',
        select: '-_id'
    })

     res.status(200).json({ msg: 'done', application })


});

