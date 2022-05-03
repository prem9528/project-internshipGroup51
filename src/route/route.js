const express = require('express');
const router = express.Router(); 
const auhorController = require("../controller/authorController");
const blogController = require("../controller/blogController");
const Auth = require("../middleWare/mid");


router.post("/authors",auhorController.createAuthor);

router.post("/blogs",Auth.authorAuth, blogController.createBlog);

router.get("/blogs",Auth.authorAuth, blogController.listBlogs);

router.put("/blogs/:blogId",Auth.authorAuth, blogController.updateblog);

router.delete("/blogs/:blogId",Auth.authorAuth,blogController.deleteBlogById);

router.delete("/blogs",Auth.authorAuth,blogController.deletBlogByParams);

router.post("/login",auhorController.loginAuthor);


module.exports = router;