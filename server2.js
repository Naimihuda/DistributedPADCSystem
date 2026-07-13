const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const setupRedis = require("./redis");
const createUserStore = require("./userStore");
const socketHandler = require("./socketHandler");

const app = express();

// Serve frontend
app.use(express.static(path.join(__dirname, "../client")));

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

(async()=>{

    const { pubClient } = await setupRedis(io);

    const userStore = createUserStore(pubClient);

    socketHandler(io,"Server 2",userStore);

    server.listen(3001,()=>{
        console.log("✅ Server 2 Running on Port 3001");
    });

})();
