const db = require('../database/database');

exports.get_characters = async () => {
  try{
    return await db
    .select(['characters.id', 'name', 'status', 'village', 'especialties'])
    .from('characters');
  }catch(err){
    console.log("DB ERROR: ", err);
  }
}
exports.get_character = async (character) => {
  try{
    if(isNaN(character)){
      return await db
      .select(['characters.id', 'name'])
      .from('characters')
      .where({ slug: character });
    }else{
      return await db
      .select(['characters.id', 'name'])
      .from('characters')
      .where({ id: character });
    }
  }catch(err){
    console.log("DB ERROR: ", err);
  }
}
exports.new_character = async (data) => {
  try{
    return await db
    .insert(data)
    .into( 'characters');
  }catch(err){
    console.log("DB ERROR: ", err);
  }
}
exports.update_character = async (character, data) => {
  try{
    if(isNaN(character)){
      return await db
      .table('characters')
      .update(data)
      .where({ slug: character });
    }else{
      return await db
      .table('characters')
      .update(data)
      .where({ id: character });
    }
  }catch(err){
    console.log("DB ERROR: ", err);
  }
}
exports.delete_character = async (character) => {
  try{
    if(isNaN(character)){
      return await db
      .table('characters')
      .where({ slug: character })
      .del();
    }else{
      return await db
      .table('characters')
      .where({ id: character })
      .del();
    }
  }catch(err){
    console.log("DB ERROR: ", err);
  }
}