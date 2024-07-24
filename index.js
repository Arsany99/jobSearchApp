import dotenv from "dotenv"
dotenv.config()
import express from 'express'
import connectionDB from './db/connectionDB.js'
import userRouter from './src/modules/users/user.routes.js'
import companyRouter from './src/modules/Companies/company.routes.js'
import jobRouter from './src/modules/Jobs/job.routes.js'
import applicationRoutes from './src/modules/Applications/application.routes.js'
import { globalErrorHandling } from './src/utils/globalErrorHandler.js'
import { AppError } from './src/utils/calssError.js'
const app = express()
const port = process.env.PORT || 3001

app.use(express.json())


app.use('/users' , userRouter)
app.use('/company' , companyRouter)
app.use('/jobs' , jobRouter)
app.use('/applications', applicationRoutes);



connectionDB()


app.use("*" , (req ,res , next)=>{
    //res.status(404).json({msg:'page not dound'})
    return next(new AppError(`invalid url ${req.originalUrl}`,404))
})
app.use(globalErrorHandling)




app.listen(port, () => console.log(`Example app listening on port ${port}!`))