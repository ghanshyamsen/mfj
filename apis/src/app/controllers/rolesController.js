const RolesModel = require("../../models/roles");
const User = require("../../models/user");

class Roles {

  async get(req, res) {

    try{

      const { key } = req.params;

      if(key){

        const getaRoles = await RolesModel.findById(key);
        if(getaRoles){
          return res.status(200).json({status: 'success', data: getaRoles});
        }else{
          return res.status(200).json({status: 'error', message: "Invalid role requested."});
        }
      }else{

        const getRoles = async () => {

          const roles = await RolesModel.find({admin_id:req.user.userId}, 'role_name updatedAt');

          const defaultValues = [];
          let idx = 1;

          for (const role of roles) {

            defaultValues.push({
              s_no: idx,
              id: role._id,
              role_name: role.role_name,
              updated: new Date(role.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            });

            idx++;
          }

          return defaultValues;
        };

        getRoles().then(defaultValues => {
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

      postData.admin_id = req.user.userId;

      const create = await RolesModel.create(postData);

      return res.status(200).json({status:true, data:create, message:"Role added successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

  async update(req, res) {

    try{

      const { key } = req.params;

      const postData = req.body;

      postData.admin_id = req.user.userId;

      const update = await RolesModel.findOneAndUpdate(
        {_id: key},
        {$set: postData},
        {new: true}
      );

      if(update){
        return res.status(200).json({status:true, data:update, message:"Role updated successfully."});
      }else{
        return res.status(200).json({status:false, message:"Invalid roles request."});
      }

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }
  }

  async delete(req, res) {

    try{

      const { key } = req.params;

      const count = await User.countDocuments({role:key});

      if(count > 0){
        return res.status(200).json({status:false, message:"You can't delete this role, it's assigned to user."});
      }

      await RolesModel.findOneAndDelete({ _id: key });

      return res.status(200).json({status:true, message:"Roles deleted successfully."});

    }catch(err){
      return res.status(200).json({status:false, message:err.message });
    }

  }

}


module.exports = Roles;
