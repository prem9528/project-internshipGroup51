const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const mongoose = require("mongoose");


const isValid = function (value) {


    console.log(isValid)
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}




const createCollege = async function (req, res) {

    try {
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid request parameters. Please provide another details" })
            return
        }

        let { name, fullName, logoLink, isDeleted  } = requestBody;

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: "First name is required" })
            return
        }
        
        if (!isValid(fullName)) {
            res.status(400).send({ status: false, message: "Last name is required" })
            return
        }
        
        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, message: "Title is required" })
            return
        }
        if (!isValid(isDeleted)) {
            res.status(400).send({ status: false, message: "Title is required" })
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



//API2 b

/*Create a blog document from request body. Get authorId in request body only.

Make sure the authorId is a valid authorId by checking the author exist in the authors collection.

Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this

Create atleast 5 blogs for each author

Return HTTP status 400 for an invalid request with a response body*/


const createBlog = async function (req, res) {
    try {
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid request parameters. Please provide another details" })
            return
        }
        let { title, body, authorId, tags, subcategory, isPublished, category } = requestBody;

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: "Blog Title is required" })
            return
        }
        if (!isValid(body)) {
            res.status(400).send({ status: false, message: "Blog body is required" })
            return
        }
        if (!isValid(authorId)) {
            res.status(400).send({ status: false, message: "Author id is required" })
            return
        }
        if (!isValidObjectId(authorId)) {
            res.status(400).send({ status: false, message: `${authorId} is not a valid author id` })
            return
        }
        if (!isValid(category)) {
            res.status(400).send({ status: false, message: "Blog category is required" })
            return
        }
        const author = await authorModel.findById(authorId);
        if (!authorId) {
            res.status(400).send({ status: false, message: "Author does not exist" })
            return
        }
        const blogData = {
            title,
            body,
            authorId,
            category,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null
        }
        if (tags) {
            if (Array.isArray(tags)) {
                blogData[`tags`] = [...tags]
            }
            if (Object.prototype.toString.call(tags) === "[object String]") {
                blogData["tags"] = [tags]
            }

        }
        if (subcategory) {
            if (Array.isArray(subcategory)) {
                blogData[`subcategory`] = [...subcategory]
            }
            if (Object.prototype.toString.call(subcategory) === "[object String]") {
                blogData["subcategory"] = [subcategory]
            }

        }
        const newBlog = await blogModel.create(blogData)
        res.status(201).send({ status: true, message: "New blog created sucessfully", data: newBlog })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
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



const listBlogs = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null, isPublished: true }
        const queryParams = req.query

        if (isValidRequestBody(queryParams)) {
            const { authorId, category, tags, subcategory } = queryParams
            if (isValid(authorId) && isValidObjectId(authorId)) {
                filterQuery["authorId"] = authorId
            }
            if (isValid(category)) {
                filterQuery["category"] = category.trim()
            }
            if (isValid(tags)) {
                const tagsArr = tags.trim().split(",").map(subcat => tags.trim());
                filterQuery["tags"] = { $all: tagsArr }
            }
            if (isValid(subcategory)) {
                const subcatArr = subcategory.trim().split(",").map(subcat => subcat.trim());
                filterQuery["subcategory"] = { $all: subcatArr }
            }
        }
        const blogs = await blogModel.find(filterQuery)
        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(404).send({ status: false, message: "No blog found" })
            return
        }
        res.status(200).send({ status: true, message: "Blogs list", data: blogs })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
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
    try {
        let requestBody = req.body;
        let params = req.params
        let blogId = params.blogId;
        let authorIdFromToken = req.authorId

        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, message: `${blogId} is not a valid blog id` })
            return
        }
        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
            return
        }
        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null });
        if (!blog) {
            res.status(404).send({ status: false, message: "Blog not found" })
            return
        }
        if (blog.authorId.toString() !== authorIdFromToken) {
            res.status(401).send({ status: false, message: "Unauthorized access! Owner info doesn't match" });
            return
        }
        if (!isValidRequestBody(requestBody)) {
            res.status(200).send({ status: true, message: "No parameters passed. Blog unmodified", data: blog })
            return
        }
        const { title, body, tags, subcategory, category, isPublished } = requestBody;
        const updatedBlogData = {}
        if (!isValid(title)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, "$set")) updatedBlogData[`$set`] = {}
            updatedBlogData[`$set`][`title`] = title
        }
        if (!isValid(body)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, "$set")) updatedBlogData[`$set`] = {}
            updatedBlogData[`$set`][`body`] = body
        }
        if (!isValid(category)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, "$set")) updatedBlogData[`$set`] = {}
            updatedBlogData[`$set`][`category`] = category
        }
        if (isPublished !== undefined) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, "$set")) updatedBlogData[`$set`] = {}
            updatedBlogData[`$set`][`isPublished`] = isPublished
            updatedBlogData[`$set`][`publishedAt`] = isPublished ? new Date() : null
        }
        if (tags) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, "$addToSet")) updatedBlogData[`$addToSet`] = {}
            if (Array.isArray(tags)) {
                updatedBlogData[`$addToSet`][`tags`] = { $each: [...tags] }
            }
            if (typeof tags === "string") {
                updatedBlogData[`$addToSet`][`tags`] = tags
            }
        }
        if (subcategory) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, "$addToSet")) updatedBlogData[`$addToSet`] = {}
            if (Array.isArray(subcategory)) {
                updatedBlogData[`$addToSet`][`tags`] = { $each: [...subcategory] }
            }
            if (typeof subcategory === "string") {
                updatedBlogData[`$addToSet`][`subcategory`] = subcategory
            }
        }
        const updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, updatedBlogData, { new: true })
        res.status(200).send({ status: true, messgae: "Blog updated sucessfully", data: updatedBlog })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


//API5


// DELETE /blogs/:blogId
// - Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

const deleteBlogById = async function (req, res) {
    try {
        let params = req.params
        let blogId = params.blogId
        let authorIdFromToken = req.authorId
        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, message: `${blogId} is not a valid blog id` })
            return
        }
        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
            return
        }
        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null })
        if (!blog) {
            res.status(404).send({ status: false, message: "Blog not found" })
            return
        }
        if (blog.authorId.toString() !== authorIdFromToken) {
            res.status(401).send({ status: false, message: "Unauthorized access! Owner info doesn't match" });
            return
        }
        await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


//API6


// ### DELETE /blogs?queryParams
// - Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure)

const deletBlogByParams = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null }
        const queryParams = req.query
        let authorIdFromToken = req.authorId
        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
            return
        }
        if (!isValidRequestBody(queryParams)) {
            res.status(400).send({ status: false, message: "No query params received . Aborting delete operadtion" })
            return
        }
        const { authorId, category, tags, subcategory, isPublished } = queryParams
        if (isValid(authorId) && isValidObjectId(authorId)) {
            filterQuery["authorId"] = authorId
        }
        if (isValid(category)) {
            filterQuery["category"] = category.trim()
        }
        if (isValid(isPublished)) {
            filterQuery["isPublished"] = isPublished
        }
        if (isValid(tags)) {
            const tagArr = tags.trim().split(",").map(tag => tag.trim());
            filterQuery["tags"] = { $all: tagArr }
        }
        if (isValid(subcategory)) {
            const subcatArr = subcategory.trim().split(",").map(subcat => subcat.trim());
            filterQuery["subcategory"] = { $all: subcatArr }
        }
        const blogs = await blogModel.find(filterQuery);
        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(404).send({ status: false, message: "No matching blog found" })
            return
        }
        const idsOfBlogsToDelete = blogs.map(blog => {
            if (blog.authorId.toString() === authorIdFromToken) return blog._id
        })
        if (idsOfBlogsToDelete.length === 0) {
            res.status(404).send({ status: false, message: "No blogs found" })
            return
        }
        await blogModel.updateMany({ _id: { $in: idsOfBlogsToDelete } }, { $set: { isDeleted: true, deletedAt: new Date() } })
        res.status(200).send({ status: true, message: "Blog(s) deleted sucessfully" });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


module.exports = { createBlog, listBlogs, updateblog, deleteBlogById, deletBlogByParams }