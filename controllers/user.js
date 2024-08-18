const userdb = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const keysecret = process.env.JWT_SECRET_KEY || "default_secret_key";
// Email config

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  secureConnection: true,
  auth: {
    user: process.env.EMAIL || "thoravenger641@gmail.com",
    pass: process.env.PASSWORD || "cnrb somy ifnk gvyi",
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// User Registeration

async function userRegisteration(req, res) {
  const { username, email, password, cpassword } = req.body;
  console.log(req.body);
  if (!username || !email || !password || !cpassword) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const preuser = await userdb.findOne({ email: email });

    if (preuser) {
      res.status(422).json({ error: "This Email is Already Exist" });
    } else if (password !== cpassword) {
      res
        .status(422)
        .json({ error: "Password and Confirm Password Not Match" });
    } else {
      const finalUser = new userdb({
        username,
        email,
        password,
        cpassword,
      });

      // here password hasing

      const storeData = await finalUser.save();
      res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    res.status(422).json(error);
    console.log("catch block error");
  }
}

// user Login

async function userLogin(req, res) {
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const userValid = await userdb.findOne({ email: email });

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);

      if (!isMatch) {
        res.status(422).json({ error: "invalid details" });
      } else {
        // token generate
        const token = await userValid.generateAuthtoken();

        // cookiegenerate
        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });

        const result = {
          userValid,
          token,
        };
        res.status(201).send({ status: 201, result });
      }
    } else {
      res.status(401).json({ status: 401, message: "invalid details" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
    console.log("catch block", error);
  }
}

// user logout

async function userLogout(req, res) {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("usercookie", { path: "/" });

    req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
}

module.exports = {
  userRegisteration,
  userLogin,

  userLogout,
};
