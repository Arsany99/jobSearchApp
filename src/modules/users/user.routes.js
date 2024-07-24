import express from 'express'
import { deleteUser, forgetPassword, getAccountRecoverData, getAnotherUserData, getUserData, getUsers, resetPassword, signUp, signin, updateUser, updateUserPassword } from './user.controller.js';
import { validation } from '../../middelware/validation.js';
import { signInVaildator, signUpVaildator, updatePassword } from './user.validator.js';
import { auth } from '../../middelware/auth.js';
import { systemRoles } from '../../utils/systemRoles.js';
const router = express.Router();



router.get('/' ,getUsers )
router.post('/signup' , validation(signUpVaildator), signUp)
router.post('/signin' , validation(signInVaildator), signin)
router.patch('/update' , auth([systemRoles.companyHr,systemRoles.user]), updateUser)
router.delete('/delete' , auth([systemRoles.companyHr,systemRoles.user]), deleteUser)
router.get('/userData' ,auth([systemRoles.companyHr,systemRoles.user]),getUserData )
router.get('/getAnotherUserData/:id' ,auth([systemRoles.companyHr,systemRoles.user]),getAnotherUserData )
router.patch('/updateUserPassword' , auth([systemRoles.companyHr,systemRoles.user]),validation(updatePassword), updateUserPassword)
router.patch('/forgetPassword' , forgetPassword)
router.patch('/resetpassword' ,validation(updatePassword),resetPassword )
router.get('/getAccountRecoverData' ,auth([systemRoles.companyHr,systemRoles.user]),getAccountRecoverData )




export default router