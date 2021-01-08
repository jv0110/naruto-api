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