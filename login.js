const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("./database-config");

function initialize(passport, userlist) {
  async function authenticateUser(username, password, done) {
    var usersOnline = userlist;

    for (var s in usersOnline) /*check if user is already logged in*/ {
      if (usersOnline[s].name === username)
        return done(null, false, { message: "User is already logged in" });
    }
    try {
      var sql = "SELECT ID, UserPassword FROM usertable WHERE UserName = ?";
      db.query(sql, username, function (err, result) {
        if (result.length >= 1) {
          if (bcrypt.compareSync(password, result[0].UserPassword)) {
            user = {
              id: result[0].ID,
            };
            return done(null, user); //user found and password matches!!!!!
          } else return done(null, false, { message: "Password incorrect" }); //password did not match
        } else return done(null, false, { message: "User does not exist" }); //no user with that name in db
      });
    } catch (err) {
      console.log(err);
      return done(null, false); //unknown error
    }
  }

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );

  passport.serializeUser((user, done) => {
    done(null, user.id); //saves id to cookies
  });

  passport.deserializeUser((id, done) => {
    done(null, getUser(id));
  });
  async function getUser(id) {
    try {
      var sql = "SELECT ID, UserName, DisplayName FROM usertable WHERE ID = ?";
      db.query(sql, id, function (err, result) {
        if (result) {
          var user = {
            name: result[0].UserName,
            id: result[0].ID,
            displayname: result[0].DisplayName,
          };
          return user;
        } else {
          console.log("Could not find user in database " + err);
        }
      });
    } catch (err) {
      console.log("deserialization failed: " + err);
    }
  }
}

module.exports = initialize;
