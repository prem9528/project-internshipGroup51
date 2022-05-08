const mongoose = require("mongoose");
// const validator = require("validator");

const collegeSchema = new mongoose.Schema({
    name: {
         type: String, 
         trim: true,
        required: "Name is required", 
        unique: true 
        }, 
    fullName: { 
        type: String, 
        trim: true,
       required: "Fullname is required" }, 
    logoLink: { 
        type: String,
        required: "Logo URL is required" ,
        trim: true
         }, 
    isDeleted: { 
        type: Boolean, 
        default: false
     } 
}, { timestamps: true });
module.exports = mongoose.model("College", collegeSchema);
