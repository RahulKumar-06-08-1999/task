const asyncHandler = require("../middleware/async");
const User = require("../models/user");



// @desc    User Register
// @route   POST api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  console.log(req.body); // Log the request body to see if it matches the expected format

  const { firstName, lastName, email, password } = req.body;

  try {
      if (!firstName) {
          return res.status(400).json({ "Error": "Please provide a valid first_name" });
      }

      if (!lastName) {
          return res.status(400).json({ "Error": "Please provide a valid last_name" });
      }

      // Check if email is provided and has a valid format
      if (!email || !email.includes('@')) {
          return res.status(400).json({ "Error": "Please provide a valid email address" });
      }

      // Check if password is provided and has a minimum length
      if (!password || password.length < 8) {
          return res.status(400).json({ "Error": "Please provide a password with at least 8 characters" });
      }

      // Create User
      const user = await User.create({
          firstName,
          lastName,
          email,
          password,
      });

      return res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
  }  
});







// @desc    User Login
// @route   POST api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  // Validate email and password
  if(!email || !password){
      return  res.status(400).json({ "Error": "Please Provide an Email And Password" });
  };

  // Check for User
  const user = await User.findOne( { email } ).select("+password");

  if(!user){
      return res.status(401).json({ "Error": "Invalid Credentials" });
  };

  // Check if password matches
  const isMatch = await user.matchPassword(password); 
  
  if(!isMatch){
      return res.status(401).json({ "Error": "Invalid Credentials" });
  };

  // If login is successful, send token response
  sendTokenResponse(user, 200, res);

});



// @desc Log user out / clear cookie
// @route  GET/api/v1/auth/logout
// @access Private
exports.logout = asyncHandler(async (req, res, next) =>{
  res.cookie("token", "none", {
    expires : new Date(Date.now() + 10 *1000),
    httpOnly : true
  });
  
  res.status(200).json({
    success : true,
    data :  {}
  });

});


// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});




// Get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const accessToken = user.getSignedJwtToken();

  const options = {
  httpOnly: true,
  // secure: true,
  maxAge: 24 * 60 * 60 * 1000,
  // signed: true
};

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

    res.status(statusCode)
    .cookie('token', accessToken, options)
    .json({
      success: true,
      accessToken
   });
};



