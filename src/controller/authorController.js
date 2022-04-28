const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
    
    try {
        let data = req.body;
        
        let {fname , lname , title , email , password} = data;
        if(!fname){
            return res.status(400).send({msg: "First Name is required...!"});
        }
        if(!lname){
            return res.status(400).send({msg: "LastName is required..!"});
        }
        if(!title){
            return res.status(400).send({msg: "Title is required...!"});
        }
        if(!email){
            return res.status(400).send({msg: "Email is required...!"});
        }
        if(!password){
            return res.status(400).send({msg: "Password is required...!"});
        }

        let createData = await authorModel.create(data);
        res.status(201).send({ Data: createData });
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message });
    }
}


const login = async function (req, res) {

    try {
        let emailId = req.body.email;
        let pass = req.body.password;

        if (!(emailId && pass)) {
            return res.status(400).send({ err: "Email-Id and Password must be provided...!" });
        }

        let user = await authorModel.findOne({ email: emailId, password: pass });

        if (!user) {
            return res.status(401).send({ status: false, msg: "Username or the Password is not corerct..!" });
        }

        let token = jwt.sign(
            {
                authorId: user._id.toString()
            },
            "functionup-uranium"
        );

        res.status(200).send({ status: true, data: token });
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message });
    }
};


module.exports.createAuthor = createAuthor;
module.exports.login = login;