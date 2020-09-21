const User = require("../Models/User");
const jwtHelpers = require("./jwtHelpers");
const bcrypt = require("bcrypt");

//MAIN AUTH FUNCTIONS

//Login
const logIn = async ({ name, password }) => {
  try {
    const user = await helpers.checkIfUserExists(name);
    if (user.length === 0)
      throw new AuthError({
        error: true,
        message: "No such user",
        status: 404,
      });

    const checkPassword = await helpers.checkPassword(user[0], password);

    if (!checkPassword)
      throw new AuthError({
        error: true,
        message: "Wrong password",
        status: 401,
      });
    const token = jwtHelpers.signToken(user[0].name);
    return { token, error: false, username: user[0].name };
  } catch (error) {
    return error;
  }
};

//Register
const register = async ({ name, password }) => {
  try {
    const user = await helpers.checkIfUserExists(name);
    if (user.length !== 0)
      throw new AuthError({
        error: true,
        message: "User with that name already exists",
        status: 400,
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({ name, password: hashedPassword })
      .save()
      .catch((err) => {
        return new AuthError({
          error: true,
          message: "Something went wrong durig user save",
        });
      });

    if (newUser.error) throw newUser;

    return { newUser, error: false };
  } catch (error) {
    return error;
  }
};

//CheckAuth
const checkAuth = (token) => {
  const isAuthenticated = jwtHelpers.verifyToken(token);
  return isAuthenticated;
};

//HELP FUNCTIONS

const helpers = {
  checkIfUserExists: async (name) => {
    const userDb = await User.find({ name })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new AuthError({
          error: true,
          message: "Error durig user search",
        });
      });
    return userDb;
  },

  checkPassword: async ({ password }, givenPassword) => {
    if (await bcrypt.compare(givenPassword, password)) return true;
    return false;
  },

  saveUser: async (name, points) => {
    const doc = await User.findOne({ name });
    doc.rank = doc.rank + points;
    const savedUser = await doc.save();
    return savedUser;
  },
};

//HELP ERROR
class AuthError {
  constructor({ error, message, status = null, auth = null }) {
    this.error = error;
    this.message = message;
    this.auth = auth;
    this.status = status;
  }
}

module.exports = { logIn, register, checkAuth, AuthError, helpers };
