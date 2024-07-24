import express from 'express'
import { addcompany, deleteCompany, getApplication, getanotherApplication, getcompanies, getcompanyData, getcompanyDataWithName, updateCompany } from './company.controller.js';
import { auth } from '../../middelware/auth.js';
import { systemRoles } from '../../utils/systemRoles.js';
import { validation } from '../../middelware/validation.js';
import { addCompanyVaildator, updateCompanyVaildator } from './company.validator.js';
const router = express.Router();



router.get('/' ,getcompanies )
router.post('/addcompany' ,validation(addCompanyVaildator) ,auth([systemRoles.companyHr]), addcompany)
router.patch('/updatecompany' ,validation(updateCompanyVaildator) ,auth([systemRoles.companyHr]), updateCompany)
router.delete('/deleteCompany' ,auth([systemRoles.companyHr]), deleteCompany)
router.get('/getcompanyData/:id',auth([systemRoles.companyHr]) , getcompanyData )
router.get('/getcompanyDataWithName',auth([systemRoles.companyHr,systemRoles.user]) , getcompanyDataWithName )
router.get('/getApplicationJob/:jobId',auth([systemRoles.companyHr]) , getApplication )
router.get('/getAnotherApplicationJob',auth([systemRoles.companyHr]) , getanotherApplication )




export default router