const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");

class Profile  {

  async get(req, res) {}

  async update(req, res) {
    try {
      const user = await Admin.findById(req.params.key);
      if (!user) {
        return res.status(401).json({ message: "Invalid Request" });
      }

      const { name, email } = req.body;

      const updatedUser = await Admin.findOneAndUpdate(
        { _id: req.params.key },
        { $set: { name, email } },
        { new: true }
      );

      if (updatedUser) {

        return res.status(200).json({
          status: "success",
          message: "Profile updated successfully",
          data: updatedUser,
        });

      } else {
        return res.status(500).json({ message: "Failed to update profile" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async resetpassword(req, res) {
    try {
      const user = await Admin.findById(req.params.key);
      if (!user) {
        return res.status(401).json({ message: "Invalid Request" });
      }

      const { current_password, password, confirm_password } = req.body;

      const isPasswordValid = await bcrypt.compare(current_password, user.password);

      if (!isPasswordValid) {
        return res.status(200).json({ status:false, message: "Invalid current password" });
      }

      if(password!=confirm_password){
        return res.status(200).json({ status:false, message: "Please ensure that the password and confirm password fields match." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedPassword = await Admin.findOneAndUpdate(
        { _id: req.params.key },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      if (updatedPassword) {
        return res.status(200).json({
          status: "success",
          message: "Password updated successfully",
          data: "",
        });
      } else {
        return res.status(401).json({ message: "Failed to update password" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

}

module.exports = Profile;
