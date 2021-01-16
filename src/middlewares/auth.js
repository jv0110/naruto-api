const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  if(!req.headers.authorization) return res.status(404).json({msg: 'No access token found'});
  const [token_name, token_value] = req.headers.authorization.split(' ');

  if(token_name !== 'Bearer') 
    return res.status(403).json({ msg: 'Invalid token' });
  jwt.verify(token_value, process.env.TOKEN_ACCESS_PASS, (err, decoded) => {
    if(err) return res.status(403).json(err);
  });

  next();
}