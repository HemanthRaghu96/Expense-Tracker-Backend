const express = require("express");
const {
  userRegisteration,
  userLogin,

  userLogout,
} = require("../controllers/user");

const authenticate = require("../middleware/authenticate");
const router = new express.Router();

// User Registeration
router.post("/register", userRegisteration);

// User login
router.post("/login", userLogin);
// user logout
router.get("/logout", authenticate, userLogout);

module.exports = router;
