const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const User = require("../../models/user");
const sendEmail = require("../../Mail/emailSender");
const SiteConfig = require("../../models/siteconfig");
const RBuilder = require("./resumebuilderController");
const Builder = new RBuilder();

class Support {

  async emailus(req, res){
    try {
      const user = await User.findById(req.user.userId).select('first_name last_name email phone_number');
      const siteConfigs = await SiteConfig.findOne({config_key:'app_site_mail'}, 'config_key config_type config_name config_value').sort({config_order:1});


      const postData = req.body;

      if(postData.subject && postData.message) {

        await sendEmail({
          email: siteConfigs.config_value,
          name: `${user.first_name} ${user.last_name}`,
          user_email: user.email,
          phone_number: user.phone_number,
          subject: postData.subject,
          message : postData.message,
          key: "contact_us_email"
        });

        res.status(200).json({status: true, message: "Mail sent successfully."});
      }else{
        res.status(200).json({status: false, message: "Subject and message is required."});
      }
    } catch (error) {
      res.status(200).json({status: false, message: error.message});
    }
  }

  async maildata(req, res) {
    try {
      const postData = req.body;

      if(postData.email){

        const user = await User.findById(req.user.userId).select('first_name last_name');
        const resume = await Builder.get(req, res, true, true);

        // Read and compile the HTML template
        //const templateSource = path.join(__dirname+'../../..', 'views', 'personalData.html');
        const templateSource = fs.readFileSync(__dirname+'/../../views/personalData.html', 'utf8');

        const template = Handlebars.compile(templateSource);

        // Generate the HTML content
        const htmlContent = template(resume);

        await sendEmail({
          email: postData.email,
          name: `${user.first_name} ${user.last_name}`,
          subject: "Personal Data Request",
          message: htmlContent,
          key: "notification_email"
        });

        res.status(200).json({status: true,message:"Your personal data sent successfully on your email address."});
      }

    } catch (error) {
      res.status(200).json({status: false, message: error.message});
    }
  }


}

module.exports = Support;
