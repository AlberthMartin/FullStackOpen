const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  //Search for the user
  const user = await User.findOne({ username });

  //check the password, passwords are not saved to the database,
  //so bcrypt.compare checks if the password is correct
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  //if user not found of password incorrect
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
// if everything is fine, then a token is created for the user as a
//digitaly signed key, only if someone knows the JWT_SECRET they can generate a key
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  
  const token = jwt.sign(
    userForToken,
    process.env.JWT_SECRET,
    {expiresIn: 60*60} //expires in 60*60 seconds (1h)
);
  //The token is sent back in the response body
  res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
