const authRoutes = require("./auth");
const userRoutes = require("./users");
const meetingRoutes = require("./meetings");

module.exports = function ({ app, dbConn }) {
  authRoutes({ app, dbConn });
  userRoutes({ app, dbConn });
  meetingRoutes({ app, dbConn });
};