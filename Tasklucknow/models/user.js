const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const UserSchema = new mongoose.Schema({

    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      match: /^[A-Za-z\s]+$/,
      minlength: [3, 'Name should be at least 3 characters'],
      maxlength: [25, 'Name cannot exceed 25 characters'],
    },
    
    lastName: {
        type: String,
        required: [true, 'Please add a last name'],
        match: /^[A-Za-z\s]+$/, 
        minlength: [3, 'Name should be at least 3 characters'],
        maxlength: [25, 'Name cannot exceed 25 characters'],
      },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },

    password: {
        type: String,
        unique: true,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false
      },
    },
    {
      timestamps : true
    }
    );
    
// Encrypt Password using bcrypt
UserSchema.pre("save",  async function(next) {
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


// Sign Jwt and Return
UserSchema.methods.getSignedJwtToken = function() {

  return jwt.sign({ id: this._id }, 
    process.env.JWT_SECRET, 
    { expiresIn : process.env.JWT_EXPIRE});

};


// Match user entered password to hashed password ,in database 
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


module.exports = mongoose.model("User", UserSchema);
    