import mongoose from 'mongoose'
import { systemRoles } from '../src/utils/systemRoles.js';

// Define the User schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  recoveryEmail: {
    type: String
  },
  DOB: {
    type: Date,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: Object.values(systemRoles),
    default: 'User'
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  otp:{
    type:String
  },
  confirmed:{
      type: Boolean,
      default: false
  }
});

// Create the User model

const userModel = mongoose.model('user', userSchema)


export default userModel