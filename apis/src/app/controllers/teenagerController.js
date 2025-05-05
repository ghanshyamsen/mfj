const User = require("../../models/user");

class Teenager {

  async get(req, res) {

    try {

      const { key } = req.params;

      if(key){

        const user = await User.findById(key);

        if (!user) {
          return res.status(200).json({ status:"F", message: "Invalid Request" });
        }

        user.profile_image =  process.env.MEDIA_URL+'avtar/'+(user.profile_image?user.profile_image:'default-user.png');

        return res.status(200).json({
          status: "success",
          data: user,
        });

      }else{

        await User.find({parents_id:req.user.userId,user_type:"teenager",user_deleted:false},'first_name last_name profile_image user_credit')
        .populate('rank','image')
        .populate('current_level','name')
        .then((result)=>{

          let list = result.map((value, index) => {
            value.profile_image =  process.env.MEDIA_URL+'avtar/'+(value.profile_image?value.profile_image:'default-user.png');
            if (value.rank) {
              if (value.rank.image && !value.rank.image.startsWith(process.env.MEDIA_URL)) {
                value.rank.image = value.rank.image
                ? process.env.MEDIA_URL + "rank/" + value.rank.image
                : "";
              }
            }
            return value;
          });

          return res.status(200).json({
            status: "success",
            data: list,
          });

        });

      }

    } catch (err) {
      return res.status(200).json({ status:"F", message: err.message });
    }

  }

  async delete(req, res) {

    try {

      const {key} = req.params;

      await User.findOneAndUpdate(
        {_id:key},
        {$set:{parents_id:''}},
        {new:true}
      );

      return res.status(200).json({status: "success", message: "Child removed successfully."});
    } catch (error) {
      return res.status(200).json({ status:"F", message: error.message });
    }

  }

}

module.exports = Teenager;
