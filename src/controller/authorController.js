const authorModel = require("../models/authorModel");

const createAuthor = async function(req,res){
    let data = req.body;
    try{
        let createData = await authorModel.create(data);
        res.status(201).send({Data : createData});
    }
    catch(err){
        res.status(500).send({ msg: "Error", error: err.message });
    }
}

module.exports.createAuthor = createAuthor;