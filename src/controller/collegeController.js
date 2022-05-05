// const mongoose = require('mongoose')
const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')

const isValid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}
const isValidURL = function (string) {
    let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

// const isValidObjectId = function(objectId){
//     return mongoose.Schema.Types.isValid(objectId)
// }

const createCollege = async function (req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide college data" })
        }

        const { name, fullName, logoLink } = requestBody

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required" })
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: "fullName is required" })
        }

        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: "logoLink is required" })
        }
        if (!isValidURL(logoLink)) {
            res.status(400).send({ status: false, message:"logo url is not valid! Please Enter a valid url"})
            return}

        const isNamePresent = await collegeModel.findOne({ name: name })

        if (isNamePresent) {
            return res.status(400).send({ status: false, message: "name already exist" })
        }
        const newCollege = await collegeModel.create(requestBody)
        
        res.status(201).send({ status: true, message: "new college entry created", data: newCollege })


    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const getCollege = async function (req, res) {
    try {
        const queryParams = req.query
        const collegeName = queryParams.collegeName

        if (!isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "please provide valid inputs for getting college details" })
        }

        if (!isValid(collegeName)) {
            return res.status(400).send({ status: false, message: "please provide collegeName" })
        }

        const isCollgePresent = await collegeModel.findOne({ name: collegeName, isDeleted: false })

        if (!isCollgePresent) {
            return res.status(404).send({ status: false, message: "invalid collegeName" })
        }

        const collegeID = isCollgePresent._id

        const intersByCollegeId = await internModel.find({ collegeId: collegeID, isDeleted: false }).select({ _id: 1, email: 1, name: 1, mobile: 1 })


        const { name, fullName, logoLink } = isCollgePresent

        const data = {
            name: name,
            fullName: fullName,
            logoLink: logoLink,
            interns: intersByCollegeId
        }

        res.status(200).send({ status: true, data: data })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

module.exports.createCollege = createCollege
module.exports.getCollege = getCollege