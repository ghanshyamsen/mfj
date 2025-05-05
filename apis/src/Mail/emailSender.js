const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
const YOUR_SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SiteConfig = require("../models/siteconfig");

const EmailTemp = require("../models/emailtemplates");

const sendMail = true;

const sendEmail = async (payload = {}) => {

  if (sendMail) {

    if(Object.keys(payload).length > 0){

      const template = await EmailTemp.findOne({ template_key: payload.key });

      if(!template){
        return {
          status: 'error',
          message: "Template not found"
        }
      }

      const siteConfigs = await SiteConfig.findOne({config_key:'app_logo'}, 'config_key config_type config_name config_value').sort({config_order:1});

      const fromMail = "info@myfirstjob.com";
      const toMail = payload.email;

      let html = template.template_content;
      let subject = (payload?.subject?payload.subject:template.template_subject);

      const siteLogo = `${process.env.MEDIA_URL}logo/${siteConfigs.config_value}`; //"../../../public/logo/logo-dark.png"


      let replacements = [
        { search: /{site_logo}/g, replacement: siteLogo },
        { search: /{logo_url}/g, replacement: siteLogo },
        { search: /{site_email}/g, replacement: fromMail },
        { search: /{site_name}/g, replacement: `<a href="${process.env.REACTAPP_URL2}">${process.env.SITE_NAME}</a>` },
        { search: /{site_title}/g, replacement: `<a href="${process.env.REACTAPP_URL2}">${process.env.SITE_NAME}</a>` },
        { search: /{year}/g, replacement: new Date().getFullYear() },
        { search: /{site_link}/g, replacement: "#" },
        { search: /{contact_mail_address}/g, replacement: fromMail },

      ]; // variables replacements


      switch (payload.key) {

        case 'forgot_password':
          replacements.push({ search: /{reset_link}/g, replacement: payload.link });
          html = str_replace(replacements, html);
        break;

        case 'registration_email':

        break;

        case 'contact_us_email':

          replacements.push({ search: /{name}/g, replacement: payload.name });
          replacements.push({ search: /{email}/g, replacement: payload.user_email });
          replacements.push({ search: /{phone_number}/g, replacement: payload.phone_number });
          replacements.push({ search: /{message}/g, replacement: payload.message });
          replacements.push({ search: /{user_name}/g, replacement: "Admin" });

          html = str_replace(replacements, html);

        break;

        case 'change_email_notification':

        break;

        case 'change_email_verification':

        break;

        case 'admin_change_email_notification':

        break;

        case 'admin_change_password_notification':

        break;

        case 'notification_email':

          let message = (payload.message)?payload.message:`write your message`; // write your message and html message.

          replacements.push({ search: /{message}/g, replacement: message });
          replacements.push({ search: /{user_name}/g, replacement: payload.name });

          html = str_replace(replacements, html);

        break;
      }

      /* Send Mail Process */
      await sgMail.setApiKey(YOUR_SENDGRID_API_KEY);

      const transporter = await nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: YOUR_SENDGRID_API_KEY
        }
      });

      const mailOptions = {
        //from: fromMail,
        from: `"My First Job" <${fromMail}>`, // sender address
        to: toMail,
        subject: subject,
        html: html,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

    }
  }
};

function str_replace(replacements, originalString) {

  let newString = originalString;

  for (const { search, replacement } of replacements) {
    if (search !== undefined && replacement !== undefined) {
      newString = newString.replace(search, replacement);
    } else {
      console.error("Invalid search or replacement:", search, replacement);
    }
  }

  return newString;
}


module.exports = sendEmail;
