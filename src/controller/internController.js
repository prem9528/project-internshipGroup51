const internModel = require("../models/internModel")
const isValid = function(value){
    if(typeof (value) === 'undefined' || value === null) return false
    if(typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function(reqBody){
    return Object.keys(reqBody).length > 0
}

const createIntern = async function (req, res) {
    try {
        const requestBody = req.body

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status: false, message: "please provide input data"})
        }
    
        const {name, email, mobile, collegeName} = requestBody
    
        if(!isValid(name)){
            return res.status(400).send({status: false, message: "Name must be provided"})
        }
    
        if(!isValid(email)){
            return res.status(400).send({status: false, message: "email must be provided"})
        }
        
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).send({status: false, message: "enter a valid email"})
        }
        if (!isValid(mobile)) res.status(400).send({ status: false, msg: "mobile is required" })
        if (!(/^([+]\d{2})?\d{10}$/.test(data.mobile))) {
            return res.status(400).send({ status: false, msg: "invalid mobile number" })
        }

        if(!isValid(collegeName)){
            return res.status(400).send({status: false, message: "collegeName must be provided"})
        }

        const isEmailNotUnique = await InternModel.findOne({email : email})
        if (isEmailNotUnique) { return res.status(422).send({ status: false, error: `${email} this Email already exist` }) }


        let isMobileExist = await internModel.findOne({ mobile: mobile })
        if (isMobileExist) { return res.status(422).send({ status: false, error: `${mobile} this number already exist` }) }
        
        const collegeByCollegeName = await CollegeModel.findOne({name : collegeName})

    if(!collegeByCollegeName){
        return  res.status(400).send({status: false, message: `no college found by this name: ${collegeName}`})
    }


        let savedData = await internModel.create(req.body)
        if (savedData.isDeleted !== false) res.status(400).send({ status: false, msg: "isDeleted must be false" })
        res.status(201).send({ status: true, data: req.body })




    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}








module.exports.createIntern = createIntern
