const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keysecret = process.env.JWT_SECRET_KEY || "default_secret_key";

// Mongoose UserSchema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("not valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verifytoken: {
    type: String,
  },
});

// Hash password

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// Generatetung token
userSchema.methods.generateAuthtoken = async function () {
    try {
      // Check if the secret key is defined
      if (!keysecret) {
        throw new Error("Secret key not defined");
      }
  
      // Generate JWT token
      let token23 = jwt.sign({ _id: this._id }, keysecret, {
        expiresIn: "1d",
      });
  
      // Append the token to the tokens array and save the user
      this.tokens = this.tokens.concat({ token: token23 });
  
      await this.save(); // Save the user with the new token
  
      return token23;
    } catch (error) {
      console.error("Error during token generation or saving:", error.message);
      throw new Error("Token generation failed");
    }
  };
  

// creating model

const userdb = new mongoose.model("users", userSchema);
module.exports = userdb;