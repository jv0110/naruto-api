const villages_model = require('../models/villages_model');
const slugify = require('slugify');

exports.get_villages = async (req, res) => {
  try{
    const villages = await villages_model.get_villages();
    if(!villages.length) return res.status(404).json("No villages found");
    return res.status(200).json(villages);
  }catch(err){
    return res.status(500).json({
      message: "Controller Error",
      error: err
    })
  }
}
exports.new_village = async (req, res) => {
  const data = {
    ...req.body,
    slug: slugify(req.body.village_name),
    createdAt: new Date()
  }
  try{
    const village = await villages_model.new_village(data);
    if(!village) return res.status(500).json("Error on addind a new village");
    return res.status(200).json({msg: "Village was added :)"});
  }catch(err){
    return res.status(500).json({
      message: "Controller Error",
      error: err
    });
  }
}
exports.update_village = async (req, res) => {
  if(!req.body.village_name) return res.status(400).json({msg: "Please especify the village"});
  if(!req.body.new) return res.status(200).json({msg: "Nothing was updated :)"});

  const village_name = req.body.village_name;
  let slug = "";
  const data = {
    ...req.body.new,
    updatedAt: new Date()
  }
  slug = data.village_name ? slugify(data.village_name) : "";
  if(slug.length > 0) data.slug = slug;

  try{
    const village = await villages_model.get_village(slugify(village_name));
    if(!village) return res.status(404).json({msg: "No village found"});
    
    console.log(village);
    const update = await villages_model.update_village(village[0].village_id, data);
    if(!update) return res.status(500).json({msg: "Could not update the village :("});

    return res.status(200).json({msg: "Village updated :)"});
  }catch(err){
    console.log(err);
    return res.status(500).json({
      message: "Controller Error",
      error: err
    });
  }
}
exports.delete_village = async (req, res) => {
  const { village } = req.body;
  try{
    const del_village = await villages_model.delete_village(slugify(village));
    console.log(del_village);
    if(!del_village) return res.status(404).json("Error deleting the village");
    return res.status(200).json({msg: "Village deleted."})
  }catch(err){
    return res.status(500).json({
      message: "Controller Error",
      error: err
    }); 
  }
}