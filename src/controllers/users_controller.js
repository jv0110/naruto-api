const users_model = require('../models/users_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validate_email = (email) => {
  const email_val = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!email || !email_val.test(email)) return false;

  return true;
}
const validate_password = (password) => {
  const password_strong = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const password_medium = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  
  if(!password_strong.test(password) || !password_medium.test(password))
    return false;

  return true;
}

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
  if(!validate_email(data.email)) 
    return res.status(400).json({ msg: 'Invalid Email' });
  if(!validate_password(data.password))
    return res.status(400).json({ msg: 'Invalid password' });
  
  try{
    const user = await users_model.get_user_by_email(data.email);
    if(user.length) return res.status(403).json({msg: "User already exists"});
    
    const salt = bcrypt.genSaltSync(11);
    if(!salt) return res.status(500).json({msg: "Error saving password"});

    const hash = bcrypt.hashSync(data.password, salt);
    if(!hash) return res.status(500).json({msg: "Error saving password"});

    data.password = hash;
    const save_user = users_model.new_user(data);
    if(!save_user) return res.status(500).json({msg: "Error saving user"});

    return res.status(200).json({msg: "User created :)"});
  }catch(err){
    return err;
  }
}
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if(!validate_email(email))
    return res.status(400).json({ msg: 'Invalid email' });
  
  try{
    const user = await users_model.get_user_by_email(email);
    if(!user.length) return res.status(404).json({ msg: 'User not found' });

    if(!bcrypt.compareSync(password, user[0].password))
      return res.status(403).json({ msg: 'Wrong password' });

    const access_token = await jwt.sign({
      id: user[0].user_id,
      email: user[0].email
    }, process.env.TOKEN_ACCESS_PASS, { expiresIn: '24h'});
    if(!access_token)
      return res.status(500).json({ msg: 'Error with the access token'});

    return res.status(200).json(access_token);
  }catch(err){
    return err;
  }
}
exports.delete_user = async (req, res) => {
  const { email } = req.body;
  if(!validate_email(email))
    return res.status(400).json({ msg: 'Invalid email' });
  
  try{
    const user = await users_model.get_user_by_email(email);
    if(!user) return res.status(404).json({msg: 'No user found'});

    const del = await users_model.delete_user(user[0].user_id);
    if(!del) return res.status(500).json({msg: 'Error deleting the user'});
    return res.status(200).json({ msg: 'User deleted :)' });
  }catch(err){
    return err;
  }
}
exports.update_user = async (req, res) => {
  if(!req.body.email) return res.status(400).json({ msg: 'Please, enter the user email you want to update'});
  if(!req.body.new) return res.status(200).json({msg: 'Nothing was updated :)'});

  const { email } = req.body;
  if(!validate_email(email))
    return res.status(500).json({ msg: 'Invalid email '});

  const new_data = {
    ...req.body.new,
    updatedAt: new Date()
  }
  if(new_data.email && !validate_email(new_data.email))
    return res.status(400).json({ msg: 'New email is invalid' });
  if(new_data.password && !validate_password(new_data.password))
    return res.status(400).json({ msg: 'New password is invalid' });
  try{
    const user = await users_model.get_user_by_email(email);
    if(!user.length) return res.status(404).json({ msg: 'No user found' });

    const user_update = await users_model.update_user(user[0].user_id, new_data);
    if(!user_update) return res.status(501).json({ msg: 'Error updating the user '});

    return res.status(200).json({ msg: 'user updated :)' });
  }catch(err){
    return err;
  }
}