"use strict";
//libraries
const express = require("express");
const app = require("express")();
var http = require("http").createServer(app);
const io = require("socket.io")(http);
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const process = require("process");
//configuration
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//external files
const db = require("./database-config");
const initializePassport = require("./login");
const register = require("./register");

app.use(
  session({
    secret: process.env.SECRET_TOKEN,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());

var userList = []; //socket connections
initializePassport(passport, userList);
app.use(passport.session());

http.listen(8080, () => {
  const host = http.address().address;
  const port = http.address().port;
  console.log(`listening on :${port}`);
});

//Routes
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  await register(req.body.username, req.body.password, req.body.displayname)
    .then(() => {
      res.redirect("/login");
    })
    .catch((msg) => {
      console.log(msg);
      res.render("register.ejs", { message: msg });
    });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/chat",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/chat", checkAuthenticated, nocache, (req, res) => {
  res.render("chat.ejs", { displayname: user.displayname });
});

//Authentication check functions and logout
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/chat");
  }
  next();
}

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}

//SOCKET BEGINS HERE
io.on("connection", (socket) => {
  //NEW USER: Establish new user, verify user, add user to list, message: connection
  socket.on("new-user", () => {
    var id = user.id;
    //Safety measure, this if statement should not run, checks if user has access to chat without login
    if (id == null) {
      socket.emit("chat-message", {
        message:
          "Whoops, something went wrong, chat is in offline mode. Please log in",
        name: "Server",
      });
      socket.disconnect();
    } else
      try {
        var sql =
          "SELECT ID, UserName,DisplayName  FROM (usertable) WHERE (ID = ?)";
        db.query(sql, id, function (err, result) {
          //create an object of the user logging in, socket.id is connection id
          userList[socket.id] = {
            id: result[0].ID,
            name: result[0].UserName,
            displayname: result[0].DisplayName,
          };
          //send table messages to joining user
          var sqlm = "SELECT Name, Message FROM chatmessages";
          db.query(sqlm, function (err, res) {
            if (err) console.log(err);
            socket.emit("dbdata", res);
          });
          io.sockets.emit("online-users-list", getOnlineUserList()); //Sends this to all online clients
          socket.broadcast.emit("chat-message", {
            message: userList.toString(),
            name: userList[socket.id].displayname,
          });
        });
      } catch (err) {
        console.log(err);
      }
  });
  //MESSAGE: Save new message to db, message: send new message
  socket.on("send-chat-message", (message) => {
    if (message.length > 254) message = "Error: message too long";
    var sql =
      "INSERT INTO chatmessages (UserID, Name, Message) VALUES (?, ?, ?)";
    var params = [
      userList[socket.id].id,
      userList[socket.id].displayname,
      message,
    ];
    //insert message into db
    db.query(sql, params, function (err) {
      if (err) console.log(err);
      socket.broadcast.emit("chat-message", {
        message: message,
        name: userList[socket.id].displayname,
      }); //sends the new message to all online clients
    });
  });
  //DISCONNECT: remove user from lists, message: disconnect
  socket.on("disconnect", () => {
    delete userList[socket.id];
    io.sockets.emit("online-users-list", getOnlineUserList());
  });
});

function getOnlineUserList() {
  var updatedList = [];
  for (var socket in userList) {
    if (!updatedList.includes(userList[socket].displayname))
      updatedList.push(userList[socket].displayname);
  }
  return updatedList;
}
