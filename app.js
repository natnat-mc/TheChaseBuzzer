
// const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const fs = require('fs')
const { Server } = require("socket.io");

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const server = https.createServer(options, app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8
});

const userMap = new Map();
let buzzList = [];

const teamsList = ["Players","Chasers"]
const teamsScore = [0,0]
let currentTeamNumber = 0;
io.on("connection", (socket) => {
  console.log("a user connected");
  // console.log(userMap);
  // userMap.set(socket.id, "Guest");
  // console.log(socket.client.conn.id);
  // console.log(socket.client.id);
  // console.log(socket.id);
  // console.log(userMap);

  socket.on("disconnect", () => {
      console.log("user disconnected");
      console.log(userMap);
  });

  //initial info on connection
  socket.emit("gameStateToClient", teamsList[currentTeamNumber], teamsScore[currentTeamNumber]);
  // socket.emit("buzzListToClient", buzzList);
  
  socket.on("buzzerPressed", (userName) => {
    buzzList.push(userName);
    io.emit("buzzListToClient", buzzList);
  });
 
  socket.on("scoresToServer", score => {
    teamsScore[currentTeamNumber] += score;
    if (teamsScore[currentTeamNumber] >= 2) {
      teamsScore[currentTeamNumber] = 0;
      currentTeamNumber = (currentTeamNumber+1)%2;
      // io.emit("switchCurrentteam");
      // io.emit("dataToClient", buzzList, teamsList[currentTeamNumber], teamsScore[currentTeamNumber]);
    }
    buzzList = [];
    io.emit("gameStateToClient", teamsList[currentTeamNumber], teamsScore[currentTeamNumber]);
    //todo ping test
    io.emit("clearBuzzers", teamsList[currentTeamNumber]);
  });
  // socket.emit("playerRoundScoreToClient");
  // socket.emit("chaserRoundScoreToClient");
  // socket.emit("currentTeamToClient");
  // socket.emit("buzzListToClient");
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

//all files in these folders can be accessed with a GET request of the filename
let assetFolders = ["styles","pages","images","audio"];
assetFolders.forEach((folderName) => {
  let folderContents = fs.readdirSync(folderName);
  folderContents.forEach((fileName) => {
    app.get("/"+fileName, (request, response) => {
      response.sendFile(folderName+"/"+fileName, {root: __dirname });
    });
  });
});


