const mysql = require("mysql");
//DB connection to WAMP#######################################################################################################

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat",
});

db.connect(function (err) {
  if (err) console.log(err);
  else console.log("Connected to database successfully.");
});

//DB connection to google cloud with (proxy)####################################################################################

// var dbconfig = {
//   user: process.env.SQL_USER,
//   database: process.env.SQL_DATABASE,
//   password: process.env.SQL_PASSWORD,
//   //socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
// };

// const db = mysql.createConnection(dbconfig);

// db.connect((err) => {
//   if (err) console.log(err);
//   else console.log("Connected to cloud database successfully.");
// });

module.exports = db;
