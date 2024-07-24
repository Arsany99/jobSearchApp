import express from 'express'
import { addjob, anotherapplyToJob, applyToJob, deleteJob, deleteJobByName, getAllJobsWithCompanyInfo, getAnyFilterJobs, getFilterJobs, getJobForcompanies, updatejob, updatejobByName } from './job.controller.js';
import { addJobValidator, updateJobValidator, updateJobWithNameValidator } from './job.validator.js';
import { validation } from '../../middelware/validation.js';
import { auth } from '../../middelware/auth.js';
import { systemRoles } from '../../utils/systemRoles.js';
import { multerHost, validExtension } from '../../services/multer.js';
const router = express.Router();


router.post('/addjob' ,validation(addJobValidator) ,auth([systemRoles.companyHr]), addjob)
router.patch('/updatejob' ,validation(updateJobValidator) ,auth([systemRoles.companyHr]), updatejob)
router.patch('/updatejobByName/:jobName' ,validation(updateJobWithNameValidator) ,auth([systemRoles.companyHr]), updatejobByName)
router.delete('/deletejobByName/:jobName' ,auth([systemRoles.companyHr]), deleteJobByName)
router.delete('/deletejob' ,auth([systemRoles.companyHr]), deleteJob)
router.get('/',auth([systemRoles.companyHr ,systemRoles.user]) ,getAllJobsWithCompanyInfo)
router.get('/',auth([systemRoles.companyHr ,systemRoles.user]), getJobForcompanies)

router.get('/filter',auth([systemRoles.companyHr ,systemRoles.user]), getFilterJobs)
router.get('/anyfilter',auth([systemRoles.companyHr ,systemRoles.user]), getAnyFilterJobs)
router.post('/apply/:jobId', auth([systemRoles.user]), applyToJob);

router.post('/anotherapply/:jobId', multerHost([...validExtension.pdf]).single('pdf') ,auth([systemRoles.user]) ,anotherapplyToJob);











export default router