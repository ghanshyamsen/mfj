const User = require("../../models/user");
const Role = require("../../models/roles");
const bcrypt = require("bcrypt");

const sendEmail = require("../../Mail/emailSender");

class SubUser {

  async get(req, res) {

    try {

      const { key } = req.params;

      if(key){

        const user = await User.findById(key);

        if (!user) {
          return res.status(200).json({ status:false, message: "Invalid Request" });
        }

        const role = await Role.findById(user.role||'');
        if(!role){
          user.role = '';
        }

        user.profile_image =  process.env.MEDIA_URL+'avtar/'+(user.profile_image?user.profile_image:'default-user.png');

        return res.status(200).json({
          status: true,
          data: user,
        });

      }else{

        const list = async () => {

          const result = await User.find({admin_id:req.user.userId,user_type:"subuser",user_deleted:false},'first_name last_name email phone_number role')


          const defaultValues = [];
          let idx = 1;

          for (const user of result) {

            const role = await Role.findById(user.role||'');

            defaultValues.push({
              s_no: idx,
              id: user._id,
              name:(user.first_name+' '+user.last_name),
              email: user.email,
              phone_number: user.phone_number,
              role_name:(role?role.role_name:'')
            });

            idx++;
          }
          return defaultValues;
        }

        list().then(list => {
          return res.status(200).json({
            status: "success",
            data: list
          });
        })

      }

    } catch (err) {
      return res.status(200).json({ status:"F", message: err.message });
    }

  }

  async create(req, res){

    try {

      const PostData = req.body;
      let email = PostData.email;
      let phone_number = PostData.phone_number;

      email = email.toLowerCase();

      // Check if the email is already registered
      const existingEmail = await User.findOne({ email, user_deleted:false  });

      if (existingEmail) {
        return res.status(200).json({ status:false, message: "This email address is already associated with an account. Please try a different email." });
      }

      // Check if the email is already registered
      const existingPhone = await User.findOne({ phone_number, user_deleted:false  });

      if (existingPhone) {
        return res.status(200).json({ status:false, message: "This phone number is already associated with an account. Please try a different phone number." });
      }

      let password = PostData.password;

      PostData.admin_id = req.user.userId;
      PostData.user_type = 'subuser';

      const hashedPassword = ((PostData.password)?(await bcrypt.hash(PostData.password, 10)):'')

      PostData.password = hashedPassword;

      const user = await User.create(PostData);

      await sendEmail({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        message : `

          You have successfully registered, here are your login details:
          <br />
          <strong>E-mail</strong>: ${user.email}
          <br />
          <strong>Password</strong>: ${password}
          <br />
          <p>Follow this link to <a href="${process.env.REACTAPP_URL2}/login" >log in</a>.</p>

        `,
        key: "notification_email",
        subject:"User Registration"
      });

      return res.status(200).json({ status:true, data: user, message: "Sub user added successfully." });

    } catch (error) {
      return res.status(200).json({ status:false, message: error.message });
    }

  }

  async update(req, res){

    try {


      const {key} = req.params
      const PostData = req.body;

      let email = PostData.email;
      let phone_number = PostData.phone_number;


      email = email.toLowerCase();

      // Check if the email is already registered
      const existingEmail = await User.findOne({ email, user_deleted:false, _id: {$ne:key}  });

      if (existingEmail) {
        return res.status(200).json({ status:false, message: "Email already exists" });
      }

      // Check if the email is already registered
      const existingPhone = await User.findOne({ phone_number, user_deleted:false, _id: {$ne:key}  });

      if (existingPhone) {
        return res.status(200).json({ status:false, message: "Phone Number already exists" });
      }
      var payload;
      if(!PostData.password){
        payload = Object.fromEntries(
          Object.entries(PostData).filter(([key]) => key !== 'password')
        );
      }else{
        const hashedPassword = ((PostData.password)?(await bcrypt.hash(PostData.password, 10)):'')
        PostData.password = hashedPassword;
        payload = PostData;
      }

      const user = await User.findOneAndUpdate(
        {_id:key},
        {$set:payload},
        {new:true}
      );

      return res.status(200).json({ status:true, data: user, message: "Sub user updated successfully." });

    } catch (error) {
      return res.status(200).json({ status:false, message: error.message });
    }

  }

  async delete(req, res) {

    try {

      const {key} = req.params;

      await User.findOneAndDelete({_id:key});

      return res.status(200).json({status: true, message: "Sub user removed successfully."});
    } catch (error) {
      return res.status(200).json({ status:false, message: error.message });
    }

  }

}

module.exports = SubUser;
