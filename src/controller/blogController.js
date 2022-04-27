const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");


//API2 

/*Create a blog document from request body. Get authorId in request body only.

Make sure the authorId is a valid authorId by checking the author exist in the authors collection.

Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this

Create atleast 5 blogs for each author

Return HTTP status 400 for an invalid request with a response body*/


const createBlog = async function(req,res){
    try{
        let data = req.body;
        let authId = req.body.authorId;
        if(!await authorModel.findById(authId)){
            res.status(401).send({Msg : "AuthorId is not valid...!"});
        }else if(await authorModel.findById(authId)){
            let createData = await blogModel.create(data);
            res.status(201).send({status : true , data : createData});
        }else{
            res.status(400).send({status : false , msg : "Bad request...!"});
        }
    }
    catch(err){
        res.status(500).send({ msg: "Error", error: err.message });
    }
}


//API3

/*Returns all blogs in the collection that aren't deleted and are published
Return the HTTP status 200 if any documents are found. The response structure should be like this
If no documents are found then return an HTTP status 404 with a response like this
Filter blogs list by applying filters. Query param can have any combination of below filters.
By author Id
By category
List of blogs that have a specific tag
List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2*/



const getBlogs = async function(req,res){
    let id = req.query.authorId;
    let category = req.query.category;
    let tag = req.query.tags;
    let subcat = req.query.subcategory;
    try{
        let filterData = await blogModel.find({ isPublished : true , isDeleted : false , $or : [ {authorId : id} , {category : category}, {subcategory : {$in : [subcat]}}, {tags : {$in : [tag]}}]});

        if(filterData.length == 0){
            return res.status(404).send({status : false , msg : "Documents not found.."});
        }
        res.status(200).send({Data : filterData});
    }
    catch(err){
        res.status(500).send({ msg: "Error", error: err.message });
    }
}



//API4

// ### PUT /blogs/:blogId
// - Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// - Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// - Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
// - Also make sure in the response you return the updated blog document.*/


const updateblog = async function (req, res) {
    try{  
        let data =  req.body; 
        let blogId = req.params.blogId;
        const tag1 = req.body.tags;
        const subcategory = req.body.subcategory;
        const title = req.body.title;
        const bod = req.body.body;

        let blog = await blogModel.findById(blogId)
        
        if(!blog){
        return res.status(404).send("No such blog exists");
        }

        if(blog.isDeleted){
        return res.status(400).send({ status: false, msg: "Blog not found, may be deleted" })
        }

        data["publishedAt"]= Date.now();

        let updatedblog = await blogModel.findByIdAndUpdate({ _id: blogId },{ $addToSet :{tags : tag1,subcategory : subcategory} , $set : {title : title , body : bod}},{new:true});

        res.status(201).send({ msg: "done", data: updatedblog });
    }
    catch (err){
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
  

//API5


// DELETE /blogs/:blogId
// - Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

const deleteblog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let blog = await blogModel.findById(blogId)
        if (!blog){
            return res.status(404).send("No such blog exists");
        }

        if(blog.isDeleted){
            return res.status(400).header({ status: false, msg: "Blog not found, may be deleted" })
        }

        let deletedtedUser = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true } }, { new: true });
        res.status(200).send({ msg: "done", data: deletedtedUser });
    }
    catch(err){
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
  

//API6


// ### DELETE /blogs?queryParams
// - Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure)

const deleteblog2 = async function (req, res) {
    try{
        let category = req.query.category
        let authorId = req.query.authorId
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        //let isPublished = req.query.isPublished

        let fetchdata = await blogModel.find({$or:[{category: category  },{tags: tags},{subcategory: subcategory}, { authorId: authorId }]})

        if(fetchdata.length == 0){
        res.status(404).send({ status: false, msg: " Blog document doesn't exist "})
        }

        let deletedtedUser = await blogModel.updateMany({$or:[{category: category  },{tags: tags},{subcategory: subcategory},{isPublished: true}, { authorId: authorId }]}, { $set: { isDeleted: true } }, { new: true });

        res.status(200).send({ msg: "done", data: deletedtedUser });
    }
    catch(err){
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
  


module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateblog = updateblog;
module.exports.deleteblog = deleteblog;
module.exports.deleteblog2 = deleteblog2;