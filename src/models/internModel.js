const mongoose = require("mongoose");
// const objectId =  mongoose.Schema.Types.ObjectId;

const internSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true,
       required: "Name is required",
       }, 
       email: {
        type: String,
         trim: true, 
         lowercase: true,
          required: "Email address is required", 
          unique: true, 
          validate: 
          {
            validator: function (email)
             {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            },
            message: 'please fill a valid email address',
            isAsync: false
        }}, 
        mobile: { type: Yup.number()
            .typeError("That doesn't look like a phone number")
            .positive("A phone number can't start with a minus")
            .integer("A phone number can't include a decimal point")
            .min(10)
            .max(12)
            .required('A phone number is required'), 
            required: "Mobile number is required",
            unique: true
        },
         collegeId:{
              type: mongoose.Types.ObjectId, 
              refs: "College", 
              required: "College name is required" },
            isDeleted: { 
                type: boolean, 
                default: false
             } 
        }, { timestamps: true });   
    

module.exports = mongoose.model("Intern", internSchema);