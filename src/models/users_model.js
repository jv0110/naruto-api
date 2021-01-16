const db = require('../database/database');

exports.get_users = async () => {
  try{
    return await db
    .select(['user_id', 'user_name', 'email'])
    .from('users');
  }catch(err){
    console.log("DB ERROR(table users): ", err);
  }
}
exports.get_user_by_email = async (email) => {
  try{
    return await db
    .select(['user_id', 'email', 'password'])
    .from('users')
    .where({ email });
  }catch(err){
    console.log("DB ERROR(table users): ", err);
  }
}
exports.new_user = async (data) => {
  try{
    return await db
    .insert(data)
    .into('users');
  }catch(err){
    console.log("DB ERROR(table users): ", err);
  }
}
exports.update_user = async (user_id, data) => {
  try{
    return await db
    .table('users')
    .update(data)
    .where({ user_id });
  }catch(err){
    console.log("DB ERROR(table users): ", err);s
  }
}
exports.delete_user = async (user_id) => {
  try{
    return await db
    .table('users')
    .where({ user_id })
    .del();
  }catch(err){
    console.log("DB ERROR(table users): ", err);
  }
}