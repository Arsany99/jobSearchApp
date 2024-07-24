import express from 'express'
import { auth } from '../../middelware/auth.js';
import { systemRoles } from '../../utils/systemRoles.js';
import { exportApplicationsToExcel } from './application.controller.js';
const router = express.Router();


router.get('/export-applications/:companyId', auth([systemRoles.companyHr]), exportApplicationsToExcel);




export default router