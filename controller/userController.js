const User= require("../models/userModel")
const mongoose=require("mongoose")

const addGoogleUser =
  (User) =>
  ({ id, email, firstName, lastName, profilePhoto,identifier ,accessT,refreshT}) => {
    const user = new User({
      id,
      email,
      firstName,
      lastName,
      profilePhoto,
      source: "google",
      identifier,
      accessT, 
      refreshT,
    });
    return user.save();
  };

const getUsers = (User) => () => {
  return User.find({});
};

const getUserByEmail =
  (User) =>
  async ({ email }) => {
    return await User.findOne({
      email,
    });
  };

module.exports = (User) => {
  return {
    addGoogleUser: addGoogleUser(User),
    getUsers: getUsers(User),
    getUserByEmail: getUserByEmail(User),
  };
};
