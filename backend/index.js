const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : "https://kiran-chatbox.netlify.app/",
        methods : ["GET", "POST"]
    },
});

io.on("connection",(socket)=> {
    console.log(`User is Connected : ${socket.id}`);

    socket.on("send-message",(message)=> {
        console.log(message);
        //received message to all the connection
        io.emit("received-message",message);
    })


    socket.on("disconnect",()=> console.log("user is disconnected"));
})

server.listen("https://kiran-chatbox.netlify.app/");
