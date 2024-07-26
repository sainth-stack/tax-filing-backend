const express = require("express");
const router = express.Router();
const {
  signUpWithProvider,
  registerUser,
  loginUser,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyOTP,
  forgotpassword,
  resetpassword,
  logout,
  loginMicorsoftUser,
} = require("../controllers/userController");
const prefix = "/users";
//register a user
router.post(`${prefix}/register`, registerUser);

//register a user
router.post(`${prefix}/verifyOTP`, verifyOTP);

//login a user
router.post(`${prefix}/login`, loginUser);
router.post(`${prefix}/malogin`, loginMicorsoftUser);

//register or login with google and fb
router.post(`${prefix}/signup`, signUpWithProvider);

//get all user
router.get(`${prefix}/`, getAllUsers);

//change password
router.post(`${prefix}/change-password`, changePassword);

//get a user
router.get(`${prefix}/:id`, getUserById);

//update a user
router.put(`${prefix}/:id`, updateUser);

//delete a user
router.delete(`${prefix}/:id`, deleteUser);

router.post(`${prefix}/forgotpassword`, forgotpassword);

router.post(`${prefix}/resetpassword`, resetpassword);

//logout
router.post(`${prefix}/logout`, logout);

module.exports = router;
