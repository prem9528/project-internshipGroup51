const express = require('express');
const router = express.Router(); 
const auhorController = require("../controller/authorController");
const blogController = require("../controller/blogController");


router.post("/authors",auhorController.createAuthor);

router.post("/blogs",blogController.createBlog);

router.get("/blogs",blogController.getBlogs);

router.put("/blogs/:blogId",blogController.updateblog);

router.delete("/blogs/:blogId",blogController.deleteblog);

router.delete("/blogs/:blogId",blogController.deleteblog2);


module.exports = router;