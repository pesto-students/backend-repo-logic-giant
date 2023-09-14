const User= require("../models/userModel")
const userController= require("./userController")

module.exports=userController(User)