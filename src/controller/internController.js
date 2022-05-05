const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")

const isValid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}

const createIntern = async function (req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide input data" })
        }

        const { name, email, mobile, collegeName } = requestBody

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Name must be provided" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email must be provided" })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: "enter a valid email" })
        }
        if (!isValid(mobile)) {
            return res.status(400).send({ status: false, msg: "mobile is required" })
        }

        if (!(/^([+]\d{2})?\d{10}$/.test(requestBody.mobile))) {
            return res.status(400).send({ status: false, msg: "invalid mobile number" })
        }

        if (!isValid(collegeName)) {
            return res.status(400).send({ status: false, message: "collegeName must be provided" })
        }

        const emailPresent = await internModel.findOne({ email: email })

        if (emailPresent) {
            return res.status(422).send({ status: false, error: `${email} this Email already exist` })
        }


        let mobilePresent = await internModel.findOne({ mobile: mobile })
        if (mobilePresent) {
            return res.status(422).send({ status: false, error: `${mobile} this number already exist` })
        }

        const collegeNamePresent = await collegeModel.findOne({ name: collegeName })

        if (!collegeNamePresent) {
            return res.status(400).send({ status: false, message: `no college found by this name: ${collegeName}` })
        }


        let savedData = await internModel.create(requestBody)
        if (savedData.isDeleted !== false) {
            return res.status(400).send({ status: false, msg: "isDeleted must be false" })
        }
        res.status(201).send({ status: true, data: requestBody })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}

module.exports.createIntern = createIntern
