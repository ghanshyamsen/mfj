const express = require("express");
const router = express.Router();
const ProductCategory = require("../app/controllers/productcategoryController");
const Product = require("../app/controllers/productController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const ProductCategoryInstance = new ProductCategory();
const ProductInstance = new Product();

// Define routes

/* Product Category */
router.get("/category/get/:key?", handle, ProductCategoryInstance.get);
router.post("/category/create", handle, ProductCategoryInstance.create);
router.patch("/category/update/:key", handle, ProductCategoryInstance.update);
router.delete("/category/delete/:key", handle, ProductCategoryInstance.delete);

/* Article */
router.get("/get/:key?", handle, ProductInstance.get);
router.post("/create", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/product/', ['jpeg', 'jpg', 'png' , 'svg'], 'image', 'single').then((result) => {
        if(result.status){
            req.body.image = result.file.filename;
        }
        ProductInstance.create(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.patch("/update/:key", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/product/', ['jpeg', 'jpg', 'png', 'svg'], 'image', 'single').then((result) => {
        if(result.status){
            req.body.image = result.file.filename;
        }
        ProductInstance.update(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.delete("/delete/:key", handle, ProductInstance.delete);
router.get("/get-txn", handle, ProductInstance.gettxn);

module.exports = router;
