const multer = require("multer");
const ProductModel = require("../../models/products");
const ProductCategory = require("../../models/productcategory");
const OrderModel = require("../../models/rewarsdorder");
const User = require("../../models/user");
const sendEmail = require("../../Mail/emailSender");
const ProductCategoryModel = require("../../models/productcategory");

const { unlink } = require('node:fs/promises');
const fs = require('fs');
const mongoose = require('mongoose');

class Products {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await ProductModel.findOne({_id:key,deleted_status:false});

        const category = await ProductCategoryModel.findOne({_id:get.category,deleted_status:false});
        if(!category){
          get._doc.category = "";
        }
        return res.status(200).json({status: 'success', data: get});

      }else{

        const getProducts = async () => {

          const products = await ProductModel.find({deleted_status:false}, ' title image price updatedAt status').populate('category', 'title');

          const defaultValues = [];
          let idx = 1;

          for (const product of products) {
            defaultValues.push({
              s_no: idx,
              id: product._id,
              title: product.title,
              image: product.image,
              category: product?.category?.title,
              price: "$"+product?.price,
              status: product.status,
              updated: new Date(product.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
              updatedAt:product.updatedAt
            })
            idx++;
          }

          return defaultValues;
        };

        getProducts().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: 'success', data: defaultValues });
        });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async create(req, res){

    try{

      const postData = req.body;

      const create = await ProductModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Product created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;


      const article = await ProductModel.findById(key);

      if(!article){
        return res.status(200).json({ status:false, message:"No product found." });
      }

      if(postData.image && article.image){
        try{
          await unlink('uploads/product/'+article.image);
        }catch(e){
          console.log(e.message);
        }
      }

      const update = await ProductModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Product updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await ProductModel.findOneAndUpdate(
        { _id: key },
        {$set: {deleted_status: true}},
        {new: true}
      );

      return res.status(200).json({status:true, message:"Product deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async getproducts(req, res){

    try {

      const { key } = req.params;
      const { keyword, sort, offset, limit, category } = req.query;
      const userId = req.user.userId;

      if(key){

        const product = await ProductModel.findOne({_id:key,status:true,deleted_status:false}).populate('category','title');

        if(product){

          const recommended = await ProductModel.find({category:product.category._id,status:true,deleted_status:false,_id:{$ne:product._id}}).populate('category','title').limit(10).sort({createdAt: -1}).then(function(results) {
            const defaultValues = [];
            let idx = 1;

            for (const product of results) {

              defaultValues.push({
                s_no: idx,
                id: product._id,
                title: product.title,
                category: product.category.title,
                price: product.price,
                image: (product && product.image?`${process.env.MEDIA_URL}product/${product.image}`:""),
              });

              idx++;
            }

            return defaultValues;
          });

          return res.status(200).json({status: true, data: {
            ...product._doc,
            image:(product.image?`${process.env.MEDIA_URL}product/${product.image}`:""),
          }, recommended: recommended});

        }
        else{
          return res.status(200).json({status: false, message: "The requested product could not be found."});
        }

      }else{

        const getProducts = async () => {

          let find = { status: true, deleted_status: false};

          if (category) {
            let cats = category.split(','); // Split category IDs into an array
            find.category = { $in: cats.map((id) => new mongoose.Types.ObjectId(id)) };
            // Convert each category ID to ObjectId if needed
          }

          // Ensure the keyword works properly in an aggregation
          let query = ProductModel.aggregate([
            {
              $match: find
            },
            {
              $lookup: {
                from: 'productcategories',        // The name of the collection where categories are stored
                localField: 'category',    // The local field in ProductModel that references 'category'
                foreignField: '_id',       // The foreign field in 'categories' (likely the _id field)
                as: 'categoryDetails'
              }
            },
            {
              $unwind: '$categoryDetails'  // Deconstructs the array of categoryDetails
            },
           /*  {
              $sort: { createdAt: -1 }
            }, */
            /* {
              $limit: (parseInt(limit)||20)
            } */
          ]);

          if (keyword) {
            const keywordRegex = new RegExp(keyword, 'i');
            query.append({
              $match: {
                $or: [
                  { title: keywordRegex },
                  { 'categoryDetails.title': keywordRegex },
                  { description: keywordRegex },
                ]
              }
            });
          }

          if(category){
            let cats = category.split(',');
          }

          // Apply skip if offset is greater than 0

          if (offset > 0) {
            console.log(offset);
            query = query.append({ $skip: parseInt(offset) });
          }

          if (limit > 0) {
            query = query.append({ $limit: (parseInt(limit)||20) });
          }

          switch (sort) {
            case 'new':
              query = query.append({ $sort: { createdAt: -1 } });
            break;

            case 'old':
              query = query.append({ $sort: { createdAt: 1 } });
            break;

            case 'phtl':
              query = query.append({ $sort: { price: -1 } });
            break;

            case 'plth':
              query = query.append({ $sort: { price: 1 } });
            break;

            default:
              query = query.append({ $sort: { createdAt: -1 } });
            break;
          }

          const products = await query;

          const defaultValues = [];
          let idx = 1;

          for (const product of products) {

            defaultValues.push({
              s_no: idx,
              id: product._id,
              title: product.title,
              category: product.categoryDetails.title,
              price: product.price,
              image: (product && product.image?`${process.env.MEDIA_URL}product/${product.image}`:""),
              created: new Date(product.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
              createdAt:product.createdAt
            });

            idx++;
          }

          return defaultValues;
        };

        getProducts().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: true, data: defaultValues });
        });

      }

    } catch (error) {
      res.status(200).json({status:false, message:error.message});
    }

  }

  async getorders(req, res) {

    try {

      const userId = req.user.userId;

      const orders = await OrderModel.find({user: userId}).limit(1000).sort({createdAt: -1})
      .populate({
        path: 'product',
        select: 'title image price',
        populate: {
          path: 'category',
          select: 'title'
        }
      }).populate('user', 'first_name last_name');

      const defaultValues = [];

      for (const order of orders) {
        defaultValues.push({
          id: order._id,
          product_id: order.product._id,
          title: order.product.title,
          category: order.product.category.title,
          price: order.credit,
          user: `${order.user.first_name} ${order.user.last_name}`,
          image: order.product.image
            ? `${process.env.MEDIA_URL}product/${order.product.image}`
            : "",
          created: new Date(order.createdAt).toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h12', // 24-hour format
          }),
          createdAt:order.createdAt
        });
      }

      // { day: 'numeric', month: 'long', year: 'numeric' }

      res.status(200).json({status:true, data:defaultValues});

    } catch (error) {
      res.status(200).json({status:false, message:error.message});
    }

  }

  async gettxn(req, res) {

    try {

      const orders = await OrderModel.find({}).sort({createdAt: -1})
      .populate({
        path: 'product',
        select: 'title image price',
        populate: {
          path: 'category',
          select: 'title'
        }
      }).populate('user', 'first_name last_name');

      const defaultValues = [];

      for (const order of orders) {
        defaultValues.push({
          id: order._id,
          title: order.product.title,
          category: order.product.category.title,
          price: order.product.price,
          user: `${order.user.first_name} ${order.user.last_name}`,
          user_id: order.user._id,
          image: order.product.image
            ? `${process.env.MEDIA_URL}product/${order.product.image}`
            : "",
          created: new Date(order.createdAt).toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h12', // 24-hour format
          }),
          createdAt:order.createdAt
        });
      }

      // { day: 'numeric', month: 'long', year: 'numeric' }

      res.status(200).json({status:true, data:defaultValues});

    } catch (error) {
      res.status(200).json({status:false, message:error.message});
    }

  }
}


module.exports = Products;
