const multer = require("multer");
const ArticleModel = require("../../models/articles");
const ArticleCategory = require("../../models/articlecategory");
const User = require("../../models/user");
const { unlink } = require('node:fs/promises');
const fs = require('fs');


class Articles {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const get = await ArticleModel.findById(key);

        return res.status(200).json({status: 'success', data: get});

      }else{

        const getArticles = async () => {

          const atrticles = await ArticleModel.find({}, ' title image for_user updatedAt ').populate('category', 'title');

          const defaultValues = [];
          let idx = 1;

          for (const atrticle of atrticles) {
            defaultValues.push({
              s_no: idx,
              id: atrticle._id,
              title: atrticle.title,
              image: atrticle.image,
              category: atrticle?.category?.title,
              for_user: (atrticle.for_user=='teenager'?'Student':(atrticle.for_user=='parents'?'Parent':'Employer')),
              updated: new Date(atrticle.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            })
            idx++;
          }

          return defaultValues;
        };

        getArticles().then(defaultValues => {
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

      const create = await ArticleModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Article created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;


      const article = await ArticleModel.findById(key);

      if(!article){
        return res.status(200).json({ status:false, message:"No article found." });
      }

      if(postData.image && article.image){
        try{
          await unlink('uploads/article/'+article.image);
        }catch(e){
          console.log(e.message);
        }
      }

      const update = await ArticleModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Article updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {
    try{

      const { key } = req.params;

      await ArticleModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Article deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async getarticles(req, res){

    try {

      const { key } = req.params;
      const { keyword, offset } = req.query;
      const userId = req.user.userId;
      const user = await User.findOne({ _id:userId},'user_type');

      if(key){

        const article = await ArticleModel.findOne({_id:key,for_user:user.user_type,status:true}).populate('category','title');

        if(article){
          return res.status(200).json({status: true, data: {
            ...article._doc,
            image:(article.image?`${process.env.MEDIA_URL}article/${article.image}`:""),
            created: new Date(article.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          }});
        }else{
          return res.status(200).json({status: false, message: "This article is not found."});
        }

      }else{

        const getArticles = async () => {

          let find = { status: true, for_user:user.user_type };

          // Ensure the keyword works properly in an aggregation
          let query = ArticleModel.aggregate([
            {
              $match: find
            },
            {
              $lookup: {
                from: 'articlecategories',        // The name of the collection where categories are stored
                localField: 'category',    // The local field in ArticleModel that references 'category'
                foreignField: '_id',       // The foreign field in 'categories' (likely the _id field)
                as: 'categoryDetails'
              }
            },
            {
              $unwind: '$categoryDetails'  // Deconstructs the array of categoryDetails
            },
            {
              $sort: { createdAt: -1 }
            },
            {
              $limit: 20
            }
          ]);

          if (keyword) {
            const keywordRegex = new RegExp(keyword, 'i');
            query.append({
              $match: {
                $or: [
                  { title: keywordRegex },
                  { 'categoryDetails.title': keywordRegex },
                  { brief_description: keywordRegex },
                ]
              }
            });
          }

          // Apply skip if offset is greater than 0
          if (offset > 0) {
            query = query.append({ $skip: parseInt(offset) });
          }

          const articles = await query;

          const defaultValues = [];
          let idx = 1;

          for (const article of articles) {

            defaultValues.push({
              s_no: idx,
              id: article._id,
              title: article.title,
              category: article.categoryDetails.title,
              description: article.brief_description,
              type: article.type,
              link: article.url,
              image: (article && article.image?`${process.env.MEDIA_URL}article/${article.image}`:""),
              created: new Date(article.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

            idx++;
          }

          return defaultValues;
        };

        getArticles().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: true, data: defaultValues });
        });

      }

    } catch (error) {
      res.status(200).json({status:false, message:error.message});
    }

  }

}


module.exports = Articles;
