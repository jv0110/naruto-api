const characters_model = require('../models/characters_model');
const villages_model = require('../models/villages_model');
const slugify = require('slugify');

exports.get_characters =  async (req, res) => {
  try{
    const characters = await characters_model.get_characters();
    if(!characters.length) return res.status(404).json("No characters found");
    return res.status(200).json(characters);
  }catch(err){
    return res.status(500).json({
      message: "Controller error",
      error: err
    });
  }
}
exports.new_character = async (req, res) => {
  const data = {
    ...req.body,
    slug: slugify(req.body.name),
    createdAt: new Date()
  }
  try{
    const village = await villages_model.get_village(slugify(req.body.village));
    if(!village) return res.status(404).json("The specified was not found");
    
    data.village = village[0].village_id;
    const character = await characters_model.new_character(data);
    if(!character) return res.status(500).json("Error on adding the new character");
    return res.status(200).json({
      msg: "Character added :)"
    });
  }catch(err){
    console.log(err);
    return res.status(500).json({
      message: "Controller error",
      error: err
    });
  }
}
exports.edit_character = async (req, res) => {
  if(!req.body.name) return res.status(400).json({msg: "Especify the character, please"});
  if(!req.body.new) return res.status(400).json({msg: "Nothing was changed :)"});

  let slug = "";
  const name  = req.body.name;

  const new_data = {
    ...req.body.new,
    updatedAt: new Date()
  }
  slug = new_data.name ? slugify(new_data.name) : "";
  if(slug.length > 0) new_data.slug = slug;

  try{
    const find_character = await characters_model.get_character(slugify(name));
    if(!find_character) return res.status(404).json("No such character found");

    const update = await characters_model.update_character(find_character[0].id, new_data);
    if(!update) return res.status(500).json({msg: "Could not update the character"});
    
    return res.status(200).json({msg: "Character updated :)"});
  }catch(err){
    return res.status(500).json({
      message: "Controller error",
      error: err
    });
  }
}
exports.delete_character = async (req, res) => {
  const { character } = req.body;
  try{
    const del = await characters_model.delete_character(slugify(character));
    if(!del) return res.status(404).json({msg: "Couldn't find this characters to delete"});
    return res.status(200).json({
      msg: "Character deleted"
    });
  }catch(err){
    return res.status(500).json({
      message: "Controller error",
      error: err
    });
  }
}