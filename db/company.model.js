import mongoose from 'mongoose'


const companySchema = new mongoose.Schema({
    companyName :{
        type : String,
        reqired : true
    },
    description :{
        type: String ,
        required : true,
    },
    industry : {
        type: String ,
        required : true  
    },
    address:{
        type : String,
        required : true
    },
    numberOfEmployees:{
        type : String,
        required : true,
        enum: ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001+']
    },
    companyEmail:{
        type: String ,
        required : true,
        unique: true
    },
    companyHr:{
        type: mongoose.Schema.Types.ObjectId ,
        ref : 'user' , 
        required : true  
    }
} , {
    versionKey: false ,
    timestamps: true
})


const companyModel = mongoose.model('company', companySchema)


export default companyModel