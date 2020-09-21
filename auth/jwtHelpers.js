const JWT = require("jsonwebtoken");
const AuthError = require("./authHelpers");

const jwtHelpers = {
  signToken: (name) => {
    return JWT.sign(name, process.env.ACCESS_TOKEN_SECRET);
  },
  verifyToken: (token) => {
    try {
      const response = JWT.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            return {
              error: true,
              auth: false,
              message: "Token not valid",
            };
          }
          return { error: false, auth: true, user };
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  },
};

module.exports = jwtHelpers;
