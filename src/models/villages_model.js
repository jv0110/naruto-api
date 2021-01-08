const db = require('../database/database');

exports.get_villages = async () => {
  try{
    return await db
    .select(['village_id', 'village_name'])
    .from('villages');
  }catch(err){
    return {msg: "DB ERROR", error: err};
  }
}
exports.get_village = async (id) => {
  try{
    if(isNaN(id)){
      return await db
      .select(['village_id', 'village_name'])
      .from('villages')
      .where({ slug: id });
    }else{
      return await db
      .select(['village_id', 'village_name'])
      .from('villages')
      .where({ village_id: id });
    }
  }catch(err){
    return {msg: "DB ERROR", error: err};
  }
}
exports.new_village = async (data) => {
  try{
    return await db
    .insert(data)
    .into('villages');
  }catch(err){
    return {msg: "DB ERROR", error: err};
  }
}
exports.delete_village = async (village) => {
  try{
    if(isNaN(village)){
      return await db
     .table('villages')
     .where({ slug: village })
     .del();
    }else{
      return await db
      .table('villages')
      .where({ village_id: village })
      .del();
    }
  }catch(err){
    return {msg: "DB ERROR", error: err};
  }
}