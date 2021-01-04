# WampNode

Real time web chat application. Users can send messages which will be sent to other clients in real time. This app consists of signup, login and a single chatroom.
~~This project has been only tested in local network~~. This application was running in google cloud platform for a breif period of time. Here's a link of a video of the app in use <https://drive.google.com/file/d/1oeC5I7Nnakke-bWrsnA-FIFA5DHZh450/view?usp=sharing>.

This application uses 2 different servers: Node server for running the application and WAMP server for SQL data storage.
If you wish to test this project yourself:

1. Download this repository.

2. Use command `npm install` on this repositorys root directory to install required node modules.

3. Make sure you have functional SQL database.

4. You might have to modify `database-config` file depending on the settings you're using for database.

5. You have to set up your own sql database: here's mine:

```
  - CREATE DATABASE `chat`

  - CREATE TABLE `chatmessages` (
    `UserID` int(11) NOT NULL,
    `Name` varchar(20) NOT NULL,
    `Message` varchar(255) NOT NULL
    ) DEFAULT CHARSET=latin1

  - CREATE TABLE `usertable` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `UserName` varchar(20) NOT NULL,
    `UserPassword` varchar(255) NOT NULL,
    `DisplayName` varchar(20) NOT NULL,
    UNIQUE KEY `ID` (`ID`),
    UNIQUE KEY `DisplayName` (`DisplayName`),
    UNIQUE KEY `UserName` (`UserName`)
    ) DEFAULT CHARSET=latin1
```

Now that you have things set up and running, you can test your program in your local webbrowser in address <http://localhost:8080/login>
