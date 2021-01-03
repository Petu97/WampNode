# WampNode
Real time web chat application.
This project has been only used in local network.

This project has 2 types of servers: Node server for running the application as well as a WAMP server for data storage.
In case where you wish to test this project for yourself, there are few things you have to change take into account:

  1. /public/client.js -file: in the first line (inside the brackets) you have to insert the ip address of the machine, that is running the node.js server.
  
  2. You have to set up your own sql server,  here is my setup:
      1. CREATE DATABASE `chat` 
      in chat database, insert:
        1. CREATE TABLE `chatmessages` (
           `UserID` int(11) NOT NULL,
           `Name` varchar(20) NOT NULL,
           `Message` varchar(255) NOT NULL
          )  DEFAULT CHARSET=latin1
          
        2. CREATE TABLE `usertable` (
           `ID` int(11) NOT NULL AUTO_INCREMENT,
           `UserName` varchar(20) NOT NULL,
           `UserPassword` varchar(255) NOT NULL,
           `DisplayName` varchar(20) NOT NULL,
           UNIQUE KEY `ID` (`ID`),
           UNIQUE KEY `DisplayName` (`DisplayName`),
           UNIQUE KEY `UserName` (`UserName`)
          )  DEFAULT CHARSET=latin1

Now that you have things set up and running, you can test your program in your local webbrowser in address http://localhost:3000/login
