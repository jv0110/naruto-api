const users_model = require('../models/users_model');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

exports.get_users = async (req, res) => {
  try{
    const users = await users_model.get_users();
    if(!users.length) return res.status(404).json({ msg: "No users found" });
    return res.status(200).json(users);
  }catch(err){
    console.log(err);
  }
}
exports.new_user = async (req, res) => {
  const data = {
    ...req.body,
    createdAt: new Date()
  }
  try{
    const user = await users_model.get_user_by_email(data.user_email);
    if(user.length) return res.status(403).json({msg: "User already exists"});
    
    const salt = bcrypt.genSaltSync(11);
    if(!salt) return res.status(500).json({msg: "Error saving password"});

    const hash = bcrypt.hashSync(data.user_password, salt);
    if(!hash) return res.status(500).json({msg: "Error saving password"});

    data.user_password = hash;
    const save_user = users_model.new_user(data);
    if(!save_user) return res.status(500).json({msg: "Error saving user"});

    return res.status(200).json({msg: "User created :)"});
  }catch(err){
    return err;
  }
}
exports.delete_user = async (req, res) => {
  const user_email = req.body.user_email;
  try{
    const user = await users_model.get_user_by_email(user_email);
    if(!user) return res.status(404).json({msg: 'No user found'});

    const del = await users_model.delete_user(user[0].user_id);
    if(!del) return res.status(500).json({msg: 'Error deleting the user'});
    return res.status(200).json({ msg: 'User deleted :)' });
  }catch(err){
    return err;
  }
}
exports.update_user = async(req, res) => {
  if(!req.body.user_email) return res.status(400).json({ msg: 'Please, enter the user email you want to update'});
  
  const user_email = req.body.user_email;
  const email_val = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!email_val.test(user_email)) return res.status(400).json({ msg: 'Invalid email' });
 
  const new_data = {
    ...req.body.new,
    updatedAt: new Date()
  }
  try{
    const user = await users_model.get_user_by_email(user_email);
    console.log(user);
    if(!user.length) return res.status(404).json({ msg: 'No user found' });

    const user_update = await users_model.update_user(user[0].user_id, new_data);
    if(!user_update) return res.status(501).json({ msg: 'Error updating the user '});

    return res.status(200).json({ msg: 'user updated :)' });
  }catch(err){
    return err;
  }
}