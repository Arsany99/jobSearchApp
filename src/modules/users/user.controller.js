import express from 'express'
import userModel from '../../../db/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../../utils/globalErrorHandler.js'
import { AppError } from '../../utils/calssError.js'
import { nanoid } from "nanoid"
import { sendEmail } from '../../services/sendEmail.js'





export const getUsers = async (req, res, next) => {
    const users = await userModel.find()
    res.status(200).json({ msg: 'done', users })
}


//======================sign up==============//
export const signUp = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, username, password, recoveryEmail, DOB, mobileNumber, status, role } = req.body
    const emailExist = await userModel.findOne({ email })
    if (emailExist) {
        return next(new AppError('email already exist', 409))
    }
    const token = jwt.sign({ email }, 'confirmedSignture')
    const link = `http://localhost:3000/users/confirmEmail/${token}`
    const checkSendEmail= await sendEmail(email , "hi" ,`<a href ='${link}'>confirm your email</a>`)
    if (!checkSendEmail) {
    return res.status(400).json({msg:'email not send call tech team'})

    }
    const hash = bcrypt.hashSync(password, 8)
    const user = await userModel.create({ firstName, lastName, email, username, password: hash, recoveryEmail, DOB, mobileNumber, status, role })
    res.status(200).json({ msg: 'done', user })
})

//===========================================================================//
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, "confirmedSignture")
    if (!decoded?.email) {
        return res.status(400).json({ msg: 'invalid paylod' })
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true }, { new: true })
    if (!user) {
        return res.status(400).json({ msg: "user not found or already confirmed" })
    }
    res.status(200).json({ msg: 'done' })
}


//==================signin=====================//
export const signin = asyncHandler(async (req, res, next) => {
    const { identifer, password } = req.body
    const user = await userModel.findOneAndUpdate({
        $or: [
            { email: identifer },
            { recoveryEmail: identifer },
            { mobileNumber: identifer }
        ]
    }, { status: 'online' }, { new: true })
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError("invalid email or not confirmed or password", 400))
    }
    const token = jwt.sign({ name: user.firstName, email: user.email }, 'arsany')
    res.status(200).json({ msg: 'done', token })
})


//===================update=========================//
export const updateUser = asyncHandler(async (req, res, next) => {
    const { email, firstName, lastName, DOB, recoveryEmail, mobileNumber } = req.body
    const emailExist = await userModel.findOne({ email })
    const mobileNumExist = await userModel.findOne({ mobileNumber })
    if (emailExist || mobileNumExist) {
        return next(new AppError("dublicated email or mobileNumber", 400))
    }
    const user = await userModel.findOneAndUpdate({ email: req.userInfo.email }, { firstName, email, lastName, DOB,recoveryEmail,mobileNumber }, { new: true })
    res.status(200).json({ msg: 'done', user })
})



//====================delete===========//


export const deleteUser = asyncHandler( async (req, res, next) => {
        const user = await userModel.findOneAndDelete({ email: req.userInfo.email })
        res.status(200).json({ msg: 'done' })
})


//=====================get user account data===============//
export const getUserData = asyncHandler( async (req, res, next) => {
        const user = await userModel.findOne({ email: req.userInfo.email })
        res.status(200).json({ msg: 'done', user })
})


//======================Get profile data for another user =============//
export const getAnotherUserData = asyncHandler( async (req, res, next) => {
    const {id} =req.params
    const user = await userModel.findOne({ _id:id })
    res.status(200).json({ msg: 'done', user })
})


//==============================Update password ===================//
export const updateUserPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const user = await userModel.findOneAndUpdate({ email: req.userInfo.email }, { password:hash}, { new: true })
    res.status(200).json({ msg: 'done', user })
})


//=========================forget password===============//

export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email , mobileNumber } = req.body
    const otp = nanoid(6);
    const user = await userModel.findOneAndUpdate({ email, mobileNumber },{otp},{ new: true });
    if (!user) {
        return next(new AppError("invalid email or mobileNumber", 400))
    }
    res.status(200).json({ msg: 'your otp to reset your password', user , otp })
})

//================================reset password======================//
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { otp , password } = req.body
    const hash = bcrypt.hashSync(password, 8)

    const user = await userModel.findOneAndUpdate({ otp},{password:hash},{ new: true });
    if (!user) {
        return next(new AppError("invalid otp", 400))
    }
    res.status(200).json({ msg: 'your password was reset', user })
})



//===================get accounts for recovery email=======================//


export const getAccountRecoverData = asyncHandler( async (req, res, next) => {
    const {recoveryEmail}= req.body
    const user = await userModel.find({ recoveryEmail})
    res.status(200).json({ msg: 'done', user })
})