const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs')
const { Server } = require("socket.io");

var options = {
};

const server = http.createServer(options, app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8
});

const userMap = new Map();
let buzzInfo = [];
let idkList = [];
let userInfo = new Object();//Each user has properties, and is stored as a property of userInfo
let anyObjections = false;
const teamsList = ["Players","Chasers"]
const teamsScore = [0,0];
let currentTeamNumber = 0;
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
      console.log("user disconnected");
  });

  //initial info on connection
  socket.emit("gameStateToClient", teamsList[currentTeamNumber], teamsScore[currentTeamNumber]);
  
  if (anyObjections == true) {
    socket.emit("objectionToClient", "????");
  }

  socket.on("pingServer", (timeStamp) => {
    socket.emit("pingClient", timeStamp);
  });

  socket.on("buzzerPressed", (newUserName, newTimeStamp) => {
    if (idkList.includes(newUserName)) { 
      const userIndex = idkList.indexOf(newUserName);
      idkList.splice(userIndex, 1)
    }

    let firstBuzzTimeStamp = (function() { 
      if (buzzInfo.length == 0) {
        return newTimeStamp
      }
      else {
        return buzzInfo[0].timeStamp;
      }
    })();
    buzzInfo.push({ 
      userName: newUserName,
      timeStamp: newTimeStamp,
      lateTime: newTimeStamp-firstBuzzTimeStamp,
      buzzOrder: buzzInfo.length+1
    });
    io.emit("buzzInfoToClient", buzzInfo);
  });

  socket.on("idkButtonPressed", (newUserName) => {
    if (!idkList.includes(newUserName) && userInfo[newUserName] != null && userInfo[newUserName].teamName == teamsList[currentTeamNumber]) {
      idkList.push(newUserName);
      let teamSize = 0;
      for (const user in userInfo) {
        if (userInfo[user].teamName == userInfo[newUserName].teamName) {
          teamSize++;
        }
      }
      io.emit("idkListToClient", idkList);
      if (idkList.length >= teamSize) {
        io.emit("passToClient", teamsList[currentTeamNumber]);
      }
    }
  });
 
  socket.on("scoresToServer", score => {
    teamsScore[currentTeamNumber] += score;
    if (teamsScore[currentTeamNumber] >= 2) {
      teamsScore[currentTeamNumber] = 0;
      currentTeamNumber = (currentTeamNumber+1)%2;
    }
    buzzInfo = [];
    idkList = [];
    io.emit("gameStateToClient", teamsList[currentTeamNumber], teamsScore[currentTeamNumber]);
    io.emit("clearBuzzers", teamsList[currentTeamNumber]);
  });

  socket.on("updateUserInfo", (userName, teamName, buzzerId) => {
    userInfo[userName] = {
      teamName: teamName,
      buzzerId: buzzerId
    }
    io.emit("userInfoToClient", userInfo);
  });

  socket.on("unregisterUsers", () => {
    userInfo = new Object();
    io.emit("userInfoToClient", userInfo);
  });

  socket.on("objectionToServer", (userName) => {
    if (anyObjections == false) {
      io.emit("objectionToClient", userName);
      anyObjections = true;
    }
  });

  socket.on("clearObjectionToServer", () => {
    anyObjections = false;
    io.emit("clearObjectionToClient");
  });
});

// const io = new Server(server);
const port = 8080;
server.listen(port);

app.get("/", (request, response) => {
  response.sendFile("pages/home.html", {root: __dirname });
});

app.get("/host", (request, response) => {
  response.sendFile("pages/host.html", {root: __dirname });
});

app.get("/play", (request, response) => {
  response.sendFile("pages/play.html", {root: __dirname });
});

app.get("/browserFunctions.js", (request, response) => {
  response.sendFile("/browserFunctions.js", {root: __dirname });
});

//all files in these folders can be accessed with a GET request of the filename
let assetFolders = ["styles","pages","images","images/buzzers","audio","fonts"];
assetFolders.forEach((folderName) => {
  let folderContents = fs.readdirSync(folderName);
  folderContents.forEach((fileName) => {
    app.get("/"+fileName, (request, response) => {
      response.sendFile(folderName+"/"+fileName, {root: __dirname });
    });
  });
});