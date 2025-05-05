/* eslint-disable array-callback-return */
const EmailTemp = require("../../models/emailtemplates");

class Static {

    async getemails(req, res) {
        try {

            const { key } = req.params;

            if(key){
                const email = await EmailTemp.findById(key);

                return res.status(200).json({
                    status: true,
                    data: email
                });

            }else{

                const emails = await EmailTemp.find({},'template_key template_title template_subject last_update_on').then(function(emails){

                    const defaultValues = [];

                    let idx = 1;
                    emails.forEach((email) => {
                      defaultValues.push({
                        s_no: idx,
                        id: email._id,
                        template_title: email.template_title,
                        template_subject: email.template_subject,
                        last_update_on: new Date(email.last_update_on).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                      })
                      idx++;
                    });

                    return defaultValues;
                });

                return res.status(200).json({status: 'success', data: emails });
            }

        }catch (err){
            return res.status(200).json({status:false, message: err.message});
        }
    }

    async updateemail(req, res) {
        try{
            const { key } = req.params;
            const postData = req.body;

            const update = await EmailTemp.findOneAndUpdate(
                {_id: key},
                {$set: postData},
                {new: true}
            );

            return res.status(200).json({status:true, message:"Email updated successfully"});

        }catch(err){
            return res.status(200).json({status:false, message: err.message});
        }
    }
}

module.exports = Static;