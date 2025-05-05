const express = require("express");
const router = express.Router();
const ArticleCategory = require("../app/controllers/articlecategoryController");
const Article = require("../app/controllers/articleController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const ArticleCategoryInstance = new ArticleCategory();
const ArticleInstance = new Article();

// Define routes

/* Article Category */
router.get("/category/get/:key?", handle, ArticleCategoryInstance.get);
router.post("/category/create", handle, ArticleCategoryInstance.create);
router.patch("/category/update/:key", handle, ArticleCategoryInstance.update);
router.delete("/category/delete/:key", handle, ArticleCategoryInstance.delete);

/* Article */
router.get("/get/:key?", handle, ArticleInstance.get);
router.post("/create", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/article/', ['jpeg', 'jpg', 'png' , 'svg'], 'image', 'single').then((result) => {
        if(result.status){
            req.body.image = result.file.filename;
        }
        ArticleInstance.create(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.patch("/update/:key", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/article/', ['jpeg', 'jpg', 'png', 'svg'], 'image', 'single').then((result) => {
        if(result.status){
            req.body.image = result.file.filename;
        }
        ArticleInstance.update(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.delete("/delete/:key", handle, ArticleInstance.delete);


module.exports = router;
