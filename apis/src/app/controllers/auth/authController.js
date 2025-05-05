const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../../../models/admin");
const sendEmail = require("../../../Mail/emailSender");
const SiteConfig = require("../../../models/siteconfig");

class Auth {
  /* Register method */
  async register(req, res) {
    try {

      let { name, email, password } = req.body;

      // Check if the email is already registered
      email = email.toLowerCase();
      const existingUser = await Admin.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "This email address is already associated with an account. Please log in or try a different email." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = {
        name,
        email,
        password: hashedPassword,
      };

      // Save the user to the database
      const user = await Admin.create(newUser);

      return res.status(201).json({ message: "User registered successfully", data: user });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /* Login method */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const lemail = email.toLowerCase();
      // Find the user by email
      const user = await Admin.findOne({ email:lemail });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials", data:"" });
      }

      // Compare the provided password with the stored password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials", data:"" });
      }

      // Create a JWT token with the user's ID as the payload
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "12h",
      });

      const getConfigs = await SiteConfig.find({}, 'config_key config_value').sort({config_order:1});

      const defaultValues = {};
      getConfigs.forEach((config) => {
          defaultValues[config.config_key] = config.config_value==="null" ? null : config.config_value;
      });

      return res.status(200).json({
        status: "success",
        token: token,
        data: user,
        config:defaultValues
      });
    } catch (error) {
      return res.status(500).json({ message: "Login failed", data:"" });
    }
  }

  /* Forgot Password method */
  async forgetpassword(req, res) {
    try {
      const { email } = req.body;

      // Find the user by email
      const lemail = email.toLowerCase();
      const user = await Admin.findOne({ email:lemail });

      if (!user) {
        return res.status(401).json({ message: "Invalid email address." });
      }

      let randomGeneratorKey = generateRandomKey(16);

      const isUpdated = await Admin.findOneAndUpdate(
        { _id: user._id },
        { $set: { reset_password_key: randomGeneratorKey } },
        { new: true }
      );

      let resetUrl =
        process.env.REACTAPP_URL + "/reset-password/" + randomGeneratorKey;

      if (isUpdated) {

        sendEmail({
          name: user.name,
          email: user.email,
          link: resetUrl,
          key: "forgot_password"
        });

        return res.status(200).json({
          status: "success",
          message: "Reset link are sended to your mailbox, check there first",
          data: { resetUrl },
        });
      } else {
        return res.status(500).json({ message: "Failed to reset password" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Forgot password failed" });
    }
  }

  /* Reset Password method */
  async resetpassword(req, res) {
    try {

      const resetKey = req.params.key;
      const { password,confirm_password } = req.body;

      if(resetKey==''){
        return res.status(401).json({ message: "Invalid key request!!" });
      }

      if(password!=confirm_password){
        return res.status(401).json({ message: "Please ensure that the password and confirm password fields match." });
      }

      // Find the user by email
      const user = await Admin.findOne({ reset_password_key:resetKey });

      if (!user) {
        return res.status(401).json({ message: "Invalid user request." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedPassword = await Admin.findOneAndUpdate(
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
        return res.status(500).json({ message: "Failed to update password" });
      }

    } catch (error) {
      return res.status(500).json({ message: "Reset password failed" });
    }
  }
}

module.exports = Auth;
