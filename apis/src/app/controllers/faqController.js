const FaqModel = require("../../models/faq");
const fCatModel = require("../../models/faqcategory");

class Faq {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){
        const getFaq = await FaqModel.findById(key);

        return res.status(200).json({status: 'success', data: {
          id: getFaq._id,
          question: getFaq.question,
          answer: getFaq.answer,
          category: getFaq.category,
          updated: new Date(getFaq.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});
      }else{

        const getFaq = async () => {
          const faqs = await FaqModel.find({}, 'question status category updatedAt');
          const defaultValues = [];
          let idx = 1;

          for (const faq of faqs) {
            const fCat = await fCatModel.findById(faq.category);
            defaultValues.push({
              s_no: idx,
              id: faq._id,
              question: faq.question,
              category: (fCat?fCat.title:''),
              status: faq.status,
              updated: new Date(faq.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });
            idx++;
          }
          return defaultValues;
        };

        getFaq().then(defaultValues => {
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

      const create = await FaqModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Faq created successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      const update = await FaqModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      return res.status(200).json({status:true, data:update, message:"Faq updated successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {

    try{

      const { key } = req.params;

      await FaqModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Faq deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }


  async getfaqs(req, res){

    try{

      const { key } = req.params;

      if(key){
        const getFaq = await FaqModel.findById(key);

        return res.status(200).json({status: 'success', data: {
          id: getFaq._id,
          question: getFaq.question,
          answer: getFaq.answer,
          category: getFaq.category,
          updated: new Date(getFaq.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});

      }else{

        const getFaq = async () => {
          const faqsCat = await fCatModel.find({},'title');

          const defaultValues = [];
          let idx = 1;

          for (const cat of faqsCat) {
            const faqs = await FaqModel.find({category:cat._id}, 'question');

            defaultValues.push({
              s_no: idx,
              id: cat._id,
              title: cat.title,
              faqs: faqs
            });

            idx++;
          }

          return defaultValues;
        };

        getFaq().then(defaultValues => {
          // You can use defaultValues here if needed
          return res.status(200).json({status: 'success', data: defaultValues });
        });
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

}


module.exports = Faq;
