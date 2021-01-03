const db = require("./database-config");
const bcrypt = require("bcrypt");
const checkInput = require("./general");

//Registeration function, add user to database
async function RegisterUser(username, pwd, dpname) {
  return new Promise((resolve, reject) => {
    //cehck for invalid user input
    if (!checkInput(username) || !checkInput(pwd) || !checkInput(dpname))
      reject(
        "Input contains invalid letters or is too short or too long(20 char limit)"
      );
    //checking if user- or displayname are taken
    var sql =
      "SELECT ID FROM usertable WHERE (UserName = ? OR DisplayName = ?)";
    db.query(sql, [username, dpname], (err, result) => {
      if (result.length > 0) reject("username or displayname already taken!");
      else {
        //hash given password and insert new user into database
        var sql =
          "INSERT INTO usertable (UserName, UserPassword, DisplayName) VALUES (?, ?, ?)";
        bcrypt.hash(pwd, 10, function (err, hash) {
          db.query(sql, [username, hash, dpname], () => {
            resolve();
          });
        });
      }
    });
  });
}

module.exports = RegisterUser;
