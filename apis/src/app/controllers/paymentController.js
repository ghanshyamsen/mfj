const PaymentModel = require("../../models/payment");

class Payment {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const getaPayInfo = await PaymentModel.findOne({_id:key,payment_method_user:req.user.userId});

        return res.status(200).json({status: 'success', data: {
          id: getaPayInfo._id,
          payment_method: getaPayInfo.payment_method,
          card_info: getaPayInfo.card_info,
          paypal_info: getaPayInfo.paypal_info,
          default_status: getaPayInfo.default_status,
          updated: new Date(getaPayInfo.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }});

      }else{

        const getPayments = async () => {

          const payments = await PaymentModel.find({payment_method_user:req.user.userId}, 'payment_method card_info paypal_info default_status updatedAt');

          const defaultValues = [];
          let idx = 1;

          for (const payment of payments) {

            defaultValues.push({
              s_no: idx,
              id: payment._id,
              payment_method: payment.payment_method,
              card_info: payment.card_info,
              paypal_info: payment.paypal_info,
              default_status: payment.default_status,
              updated: new Date(payment.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

            idx++;
          }

          return defaultValues;
        };

        getPayments().then(defaultValues => {
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

      const paymentsCount = await PaymentModel.countDocuments({payment_method_user:req.user.userId});

      postData.payment_method_user = req.user.userId

      if(postData.card_info && postData.card_info.number){
        postData.card_info.last_four_digit = postData.card_info.number.slice(-4);
      }else{
        if(postData.paypal_info){

          postData.paypal_info = postData.paypal_info.toLowerCase();

          const getaPayInfo = await PaymentModel.findOne({paypal_info:postData.paypal_info,payment_method_user:req.user.userId});

          if(getaPayInfo){
            return res.status(200).json({status:false,  message:"This payment method is already exists."});
          }

        }
      }

      if(paymentsCount==0){
        postData.default_status = true;
      }

      const create = await PaymentModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"New payment method added successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      if(postData.default_status){
        await PaymentModel.updateMany(
          {payment_method_user:req.user.userId},
          {$set: {default_status:false}},
          {new: true}
        );
      }

      if(postData.card_info && postData.card_info.number){
        postData.card_info.last_four_digit = postData.card_info.number.slice(-4);
      }

      const update = await PaymentModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      if(update){
        return res.status(200).json({status:true, data:update, message:"Payment method updated successfully."});
      }else{
        return res.status(200).json({status:false, message:"Invalid payment method request."});
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {

    try{

      const { key } = req.params;
      const userId = req.user.userId;

      const isDelete = await PaymentModel.findOneAndDelete({ _id: key, payment_method_user:userId });

      if(isDelete){
        return res.status(200).json({status:true, message:"Payment method deleted successfully."});
      }else{
        return res.status(200).json({status:false, message:"Invalid payment method deleted request!"});
      }
    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

}


module.exports = Payment;
