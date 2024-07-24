import moment from 'moment';
import ExcelJS from 'exceljs';
import { asyncHandler } from '../../utils/globalErrorHandler.js';
import applicationModel from '../../../db/application.model.js';
import companyModel from '../../../db/company.model.js';
import jobModel from '../../../db/job.model.js';

export const exportApplicationsToExcel = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const { date } = req.query;

    // Validate date format
    const isValidDate = moment(date, 'YYYY-MM-DD', true).isValid();
    if (!isValidDate) {
        return res.status(400).json({ msg: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const startDate = moment(date).startOf('day').toDate();
    const endDate = moment(date).endOf('day').toDate();

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ msg: 'Company not found' });
    }

    // Find all jobs for this company
    const jobs = await jobModel.find({ companyHr: companyId });

    // Collect job IDs
    const jobIds = jobs.map(job => job._id);

    // Find applications for these jobs within the specified date range
    const applications = await applicationModel.find({
        jobId: { $in: jobIds },
        createdAt: { $gte: startDate, $lte: endDate }
    }).populate('userId jobId');

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
        { header: 'Job Title', key: 'jobTitle', width: 30 },
        { header: 'Applicant Name', key: 'applicantName', width: 30 },
        { header: 'Applicant Email', key: 'applicantEmail', width: 30 },
        { header: 'Technical Skills', key: 'techSkills', width: 30 },
        { header: 'Soft Skills', key: 'softSkills', width: 30 },
        { header: 'Resume Link', key: 'resumeLink', width: 50 },
        { header: 'Application Date', key: 'applicationDate', width: 20 }
    ];

    // Add rows
    applications.forEach(app => {
        worksheet.addRow({
            jobTitle: app.jobId.jobTitle,
            applicantName: `${app.userId.firstName} ${app.userId.lastName}`,
            applicantEmail: app.userId.email,
            techSkills: app.userTechSkills.join(', '),
            softSkills: app.userSoftSkills.join(', '),
            resumeLink: app.userResume,
            applicationDate: moment(app.createdAt).format('YYYY-MM-DD HH:mm:ss')
        });
    });

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers and send response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="applications_${date}.xlsx"`);
    res.send(buffer);
});
