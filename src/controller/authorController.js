const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const createAuthor = async function (req, res) {

    try {
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid request parameters. Please provide another details" })
            return
        }

        let { fname, lname, title, email, password } = requestBody;

        if (!isValid(fname)) {
            res.status(400).send({ status: false, message: "First name is required" })
            return
        }
        
        if (!isValid(lname)) {
            res.status(400).send({ status: false, message: "Last name is required" })
            return
        }
        
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: "Title is required" })
            return
        }
        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, message: "Title should be among Mr, Mrs and Miss " })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: "Email is required " })
            return
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            res.status(400).send({ status: false, message: "Email should be a valid email address" })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: "Password is required " })
            return
        }
        const isEmailAlreadyUsed= await authorModel.findOne({email});
        if(isEmailAlreadyUsed){
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }
        const authorData = { fname, lname, title, email, password }
        const newAuthor = await authorModel.create(authorData);
        res.status(201).send({ status: true, message:"Author created sucessfully", data:newAuthor  });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


const loginAuthor = async function (req, res) {
    try {
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid request parameters. Please provide another details" })
            return
        }
        const {email, password}= requestBody;
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: "Email is required " })
            return
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            res.status(400).send({ status: false, message: "Email should be a valid email address" })
            return
        } 
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: "Password is required " })
            return
        }
        let author = await authorModel.findOne({ email, password});

        if (!author) {
            res.status(401).send({ status: false, msg: "Invalid login credentials" });
            return
        }

        let token = await jwt.sign(
            {
                authorId: author._id,
                iat: Math.floor(Date.now()/ 1000),
                exp: Math.floor(Date.now()/ 1000) + 10*60*60
            },
            "functionup-uranium"
        );

        res.status(200).send({ status: true, message: `Author login sucessfull `, data: {token}});
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;