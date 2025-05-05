const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { parsePhoneNumberFromString } = require("libphonenumber-js");


const User = require("../../../models/user");
const sendEmail = require("../../../Mail/emailSender");
const Role = require("../../../models/roles");
const Reference = require("../../../models/references");

const Admin = require("../../../models/admin");

const SiteConfig = require("../../../models/siteconfig");

const axios = require('axios');

class Auth {

  /* Register method */
  async register(req, res) {

    try {


      let PostData = req.body;

      if(PostData.email){
        PostData.email = PostData.email.toLowerCase()
      }

      let email = PostData.email;
      let phone_number = PostData.phone_number;
      let social_media_id = (PostData.social_media_id||'');
      let password = (PostData.password||'');

      if(email){
        // Check if the email is already registered
        const existingUser = await User.findOne({ email, user_deleted:false  });

        if (existingUser) {
          return res.status(200).json({ status:"F", message: "This email address is already associated with an account. Please log in or try a different email." });
        }

      }else{
        // Check if the email is already registered
        const existingUser = await User.findOne({ phone_number, user_deleted:false  });

        if (existingUser) {
          return res.status(200).json({ status:"F", message: "This phone number is already associated with an account. Please log in or try a different phone number." });
        }
      }

      if(PostData.tab){
        return res.status(200).json({ status:"S"});
      }

      if(!password && !social_media_id){
        return res.status(200).json({ status:"F", message: "Password is required." });
      }

      // Hash the password
      const hashedPassword = ((password)?(await bcrypt.hash(password, 10)):'')

      PostData.password = hashedPassword;

      // Save the user to the database
      const user = await User.create(PostData);

      if(user){

        if(PostData.reference_code){
          try {
            const ref_user = await User.findById(PostData.reference_code).select('first_name last_name');

            if(ref_user){
              await Reference.create({
                reference_by:ref_user._id,
                reference_to:user._id,
                reference_code: PostData.reference_code
              });
            }

          } catch (error) {
            console.error(error.message);
          }
        }

        const admin = await Admin.findOne();

        await sendEmail({
          name: `${admin.name}`,
          email: admin.email,
          message : `
            We are pleased to inform you that a new ${user.user_type} has successfully registered in the system. Below are the details:
            <br />
            <strong>Name</strong>: ${user.first_name} ${user.last_name}
            <br />
            <strong>E-mail</strong>: ${email}
            <br />
            <br />
            Please feel free to reach out if any further action is required.

            <br />
            Thank you,
            <br />
            My First Job
          `,
          key: "notification_email",
          subject:"New User Registration Notification"
        });

        await sendEmail({
          name: `${user.first_name} ${user.last_name}`,
          email: email,
          message : `
            You have successfully registered, here are your login details:
            <br />
            <strong>E-mail</strong>: ${email}
            <br />
            <strong>Password</strong>: ${password}
            <br />
            <p>Follow this link to <a href="${process.env.REACTAPP_URL2}/login" >log in</a>.</p>
            <br />
            Please feel free to reach out if any further action is required.
            <br />
            Thank you,
            <br />
            My First Job

          `,
          key: "notification_email",
          subject:"User Registration"
        });
      }

      let expiresIn = PostData?.login_from && PostData?.login_from === 'app'?"30d":"1h";

      // Create a JWT token with the user's ID as the payload
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: expiresIn,
      });

      user.profile_image =  process.env.MEDIA_URL+'avtar/'+(user.profile_image?user.profile_image:'default-user.png');
      user.company_logo =  process.env.MEDIA_URL+'avtar/'+(user.company_logo?user.company_logo:'default-user.png');

      return res.status(200).json({
        status: "S",
        message: "User registered successfully",
        token: token,
        data: user,
      });

    } catch (error) {
      return res.status(200).json({ status:"F", message: error.message });
    }
  }

  /* Login method */
  async login(req, res) {
    try {
      const { email, phone_number, password, connect_data, tab, login_from, device_token } = req.body;

      // Find the user by email
      if(email){
        let lemail = email?.toLowerCase();
        var user = await User.findOne({ email:lemail, user_deleted:false }).populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches');
      }else{
        var user = await User.findOne({ phone_number, user_deleted:false }).populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches');
      }

      if (!user) {
        return res.status(200).json({ status:"success", isUser: false });
      }

      if(!user.status){
        return res.status(200).json({ status:"F",  message: "Your account has been deactivated by an administrator. Please contact support for further assistance." });
      }

      if((user.signup_type ==='google' || user.signup_type ==='linkedin') && !connect_data){
        return res.status(200).json({ status:"F",  message: `You have a ${user.signup_type=='google'?'Google':'Linkedin'} account associated with this email. Please log in using ${user.signup_type=='google'?'Google':'Linkedin'}.` });
      }

      if(user && !password && (user.signup_type!=='google' && user.signup_type!=='linkedin')){
        return res.status(200).json({ status:"F",  message: "It looks like you already have an account with us. Please proceed to the login page." });
      }

      if(!password && (user.signup_type!=='google' && user.signup_type!=='linkedin')){
        return res.status(200).json({ status:"F",  message: "Password is required." });
      }

      if((user.signup_type!=='google' && user.signup_type!=='linkedin')){
        if(user.password){
          // Compare the provided password with the stored password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(200).json({ status:"F", message: "Invalid credentials"});
          }
        }else{
          return res.status(200).json({ status:"F", message: "Your password is not set, please click on forgot password and set new password." });
        }
      }

      if(device_token){
        user.device_token = device_token;
        await user.save();
      }

      let expiresIn = login_from && login_from === 'app'?"30d":"1h";

      // Create a JWT token with the user's ID as the payload
      const token = jwt.sign(
        { userId: user._id, aud: "MFJ", iss: process.env.SITE_NAME },
        process.env.JWT_SECRET_KEY,
        { expiresIn: expiresIn, algorithm: 'HS256' }
      );


      const image_upload = (user.profile_image?true:false);
      const image_company_upload = (user.company_logo?true:false);


      user.profile_image =  process.env.MEDIA_URL+'avtar/'+(user.profile_image?user.profile_image:'default-user.png');
      user.company_logo =  process.env.MEDIA_URL+'avtar/'+(user.company_logo?user.company_logo:'default-user.png');

      if(user.role){
        const role = await Role.findById(user.role||'');
        if(!role){
          user.role = '';
        }else{
          user.role = JSON.stringify(role);
        }
      }

      if(user.user_type === 'subuser'){
        const admin_user = await User.findOne({_id: user.admin_id, user_deleted:false},'subscription_status plan_key subscription_next_payment_date').populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches');
        user.plan_id = admin_user.plan_id;
        user.subscription_status = admin_user.subscription_status;
        user.subscription_next_payment_date = admin_user.subscription_next_payment_date;
        user.plan_key = admin_user.plan_key;
      }

      return res.status(200).json({
        status: "success",
        token: token,
        data: {
          ...user._doc,
          image_upload:image_upload,
          image_company_upload:image_company_upload
        },
        isUser: true
      });

    } catch (error) {
      return res.status(500).json({ status:"F", message: error.message  });
    }
  }

  /* Social Login */
  async sociallogin(req, res) {
    try {
      const { socialid } = req.body;

      // Find the user by email
      const user = await User.findOne({ social_media_id:socialid, user_deleted:false });

      if (!user) {
        return res.status(200).json({ status:"F", message: "Invalid credentials" });
      }

      // Create a JWT token with the user's ID as the payload
      const token = jwt.sign(
        { userId: user._id, aud: "MFJ", iss: process.env.SITE_NAME },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '30d', algorithm: 'HS256' }
      );


      user.profile_image =  process.env.MEDIA_URL+'avtar/'+(user.profile_image?user.profile_image:'default-user.png');
      user.company_logo =  process.env.MEDIA_URL+'avtar/'+(user.company_logo?user.company_logo:'default-user.png');

      return res.status(200).json({
        status: "success",
        token: token,
        data: user,
      });

    } catch (error) {
      return res.status(500).json({ status:"F", message: "Login failed"  });
    }
  }

  /* Send OTP */
  async sendotp(req, res) {

    try {

      const { name, email, phone_number, type } = req.body;

      if(!email && !phone_number){
        return res.status(200).json({ status:"F", message: "Please provide a phone number or email address." });
      }

      /*
      if(!type){
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return res.status(200).json({ status:"F", message: "Email already exists" });
        }
      }*/

      let otp = await generateOTP(6);

      console.log("Code: ",otp);

      if(phone_number){
        var message = "OTP sent successfully on your phone number.";


        let result = await sendSms(phone_number, "Your verification OTP Code is: " + otp);

        if(!result.status){
          return res.status(200).json({ status:"F", message: result.message });
        }

      }else{
        await sendEmail({
          name: (name||''),
          email: email,
          message : "Your verification OTP Code is: " + otp,
          key: "notification_email",
          subject:"Your OTP Code"
        });

         var message = "OTP sent successfully on your email address.";
      }

      if(type){
        otp = encrypt(otp);
      }

      return res.status(200).json({ status:"S", message: message, data: { otp:otp } });

    }catch(error) {
      return res.status(500).json({ status:"F", message: error.message });
    }
  }

  /* Forgot Password method */
  async forgetpassword(req, res) {
    try {
      const { email, phone_number, type } = req.body;

      if(email){
        // Find the user by email
        let lemail = email?.toLowerCase();
        var user = await User.findOne({ email:lemail, user_deleted:false });

        if (!user) {
          return res.status(200).json({ status:"F", message: "The email address you provided is not registered. Please create an account or try a different email." });
        }
      }else{
         // Find the user by email
         var user = await User.findOne({ phone_number, user_deleted:false });

         if (!user) {
           return res.status(200).json({ status:"F", message: "The phone number you provided is not registered. Please create an account or try a different phone number." });
         }
      }

      if((user.signup_type ==='google' || user.signup_type ==='linkedin')){
        return res.status(200).json({ status:"F",  message: `It seems that you did social login, you cannot change your password!` });
      }

      let otp = await generateOTP(6);

      if(phone_number){
        var message = "OTP sent successfully on your phone number.";

        /*
        let result = await sendSms(phone_number, "Your reset password verification OTP Code is: " + otp);

        if(!result.status){
          return res.status(200).json({ status:"F", message: result.message });
        }*/

      }else{
        await sendEmail({
          name: `${user.first_name} ${user.last_name}`,
          email: email,
          message : "Your reset password verification OTP Code is: " + otp,
          key: "notification_email",
          subject:"Your OTP Code"
        });

         var message = "OTP sent successfully on your email address.";
      }

      if(type){
        otp = encrypt(otp);
      }

      return res.status(200).json({ status:"S", message: message, data: { otp:otp, id:user._id } });

      /*
        let randomGeneratorKey = generateRandomKey(16);

        const isUpdated = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: { reset_password_key: randomGeneratorKey } },
          { new: true }
        );

        let resetUrl =
          "/app/reset-password/" + randomGeneratorKey;

        if (isUpdated) {
          sendEmail(
            user.email,
            "Password Rest",
            "Here is the reset password link " + resetUrl
          );

          return res.status(200).json({
            status: "success",
            message: "Reset link are sended to your mailbox, check there first",
            data: { resetUrl },
          });
        } else {
          return res.status(500).json({ status:"F", message: "Failed to reset password" });
        }
      */

    } catch (error) {
      return res.status(500).json({ status:"F", message: "Forgot password failed", error: error.message });
    }
  }

  /* Reset Password method */
  async resetpassword(req, res) {
    try {

      const resetKey = req.params.key;
      const { password,confirm_password } = req.body;

      if(resetKey==''){
        return res.status(200).json({ status:"F", message: "Invalid key request!!" });
      }

      if(password!=confirm_password){
        return res.status(200).json({ status:"F", message: "Please ensure that the password and confirm password fields match." });
      }

      // Find the user by email
      const user = await User.findOne({ _id:resetKey });

      if (!user) {
        return res.status(200).json({ status:"F", message: "Invalid user request." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedPassword = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { password: hashedPassword,reset_password_key:null } },
        { new: true }
      );

      if (updatedPassword) {
        return res.status(200).json({
          status: "success",
          message: "Password updated successfully",
          data: "",
        });
      } else {
        return res.status(500).json({ status:"F", message: "Failed to update password" });
      }

    } catch (error) {
      return res.status(500).json({ status:"F", message: "Reset password failed" });
    }
  }

  /** Check Teenger */
  async checkteenger(req, res) {
    try {

      const { email, phone_number, uid } = req.body;

      // Find the user by email
      if(email){
        let lemail = email.toLowerCase();
        var user = await User.findOne({ email:lemail, user_deleted:false, user_type:'teenager'});
      }else{
        var user = await User.findOne({ phone_number, user_deleted:false, user_type:'teenager'});
      }


      if (!user) {
        return res.status(200).json({ status:"success", isUser: false });
      }

      if(user?.parents_id && uid && user.parents_id === uid){
        return res.status(200).json({ status:"F", message: "Your child is already added or listed." });
      }

      return res.status(200).json({ status:"success", isUser: true, id:user._id });

    } catch (error) {
      return res.status(200).json({ status:"F", message:error.message });
    }
  }

  async linkedin(req, res){
    try {
      const { code, access_token } = req.body;

      if(code){

        const params = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: `${process.env.REACTAPP_URL2}/linkedin`, // Your redirect URI
          client_id: process.env.LINKEDIN_CLIENT_KEY,
          client_secret: process.env.LINKEDIN_SECRET_KEY
        });


        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const { access_token } = response.data;

        if(access_token){
          const response = await axios.get(`https://api.linkedin.com/v2/userinfo?oauth2_access_token=${access_token}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          return res.json({ status: true, data:response.data });
        }else{
          return res.json({ status: false, message: 'Something went wrong, please try again later.' });
        }

      }else{
        if(access_token){
          const response = await axios.get(`https://api.linkedin.com/v2/userinfo?oauth2_access_token=${access_token}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          return res.json({ status: true, data:response.data });
        }
      }
    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }

  async getprivacypolicy(req, res) {
    try {

      const siteConfigs = await SiteConfig.findOne({config_key:'app_privacy_content'}, 'config_key config_type config_name config_value').sort({config_order:1});

      return res.status(200).json({
        status: true,
        data: {
          content:siteConfigs.config_value
        }
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error"
      });
    }
  }

  async getsiteconfig(req, res) {
    try {

      const siteConfigs = await SiteConfig.find({},'config_key config_type config_name config_value').sort({config_order:1});

      const data = {};
      siteConfigs.forEach(config => {
        data[config.config_key] = (config.config_key==='app_logo' || config.config_key==='app_fav_icon'?`${process.env.MEDIA_URL}logo/`:'')+config.config_value;
      });

      data['OPENAI_API_KEY'] = process.env.OPENAI_API_KEY;
      data['GOOGLE_API_KEY'] = process.env.GOOGLE_API_KEY;

      data['LINKEDIN_CLIENT_KEY'] = process.env.LINKEDIN_CLIENT_KEY;
      data['LINKEDIN_SECRET_KEY'] = process.env.LINKEDIN_SECRET_KEY;


      data['STRIPE_PUBLIC_KEY'] = process.env.STRIPE_PUBLIC_KEY;

      return res.status(200).json({
        status: true,
        data: data
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error"
      });
    }
  }

  /** Refresh JWT Token */
  async refreshtoken(req, res) {

    try {

      const userId = req.user.userId;

      // Create a JWT token with the user's ID as the payload
      const token = jwt.sign({ userId: userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      return res.status(200).json({status:true, token: token });

    } catch (error) {
      return res.status(200).json({status:false, message: "Internal server error"});
    }
  }


  async checkexists(req, res) {
    try {

      let PostData = req.body;

      if(PostData.email){
        PostData.email = PostData.email.toLowerCase()
      }

      let email = PostData?.email;
      let phone_number = PostData?.phone_number;

      if(email || phone_number){
        if(email){
          // Check if the email is already registered
          const existingUser = await User.findOne({ email, user_deleted:false  });

          if (existingUser) {
            return res.status(200).json({ status:false, message: "This email address is already associated with an account." });
          }

        }else{
          // Check if the email is already registered
          const existingUser = await User.findOne({ phone_number, user_deleted:false  });

          if (existingUser) {
            return res.status(200).json({ status:false, message: "This phone number is already associated with an account." });
          }
        }

        return res.status(200).json({status:true, message: "This is valid."});

      }else{
        return res.status(200).json({status:false, message: "Invalid email or number."});
      }

    } catch (error) {
      return res.status(200).json({status:false, message: "Internal server error"});
    }
  }

  async checknumber(req, res) {
    try {

      let PostData = req.body;

      let phone_number = PostData?.phone_number;

      if(phone_number){

        const parsedPhoneNumber = parsePhoneNumberFromString(phone_number, 'US');

        if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
          return res.status(200).json({ status:false, message: 'Please enter a valid phone number' });
        }

        return res.status(200).json({status:true, message: "This is valid."});

      }else{
        return res.status(200).json({status:false, message: "Invalid number."});
      }

    } catch (error) {
      return res.status(200).json({status:false, message: error.message});
    }
  }



}

module.exports = Auth;
