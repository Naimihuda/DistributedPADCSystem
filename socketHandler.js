module.exports = function socketHandler(io, serverName, userStore){

    io.on("connection",(socket)=>{

        console.log(`[${serverName}] Connected: ${socket.id}`);

        socket.on("join", async ({username, role})=>{

            await userStore.addUser(
                socket.id,
                username,
                role,
                serverName
            );

            socket.emit("server", serverName);

            io.emit("users", await userStore.getUsers());

            io.emit("message",{
                username:"System",
                role:"System",
                text:`${username} joined the system.`,
                type:"system",
                time:new Date().toLocaleTimeString()
            });

        });

        socket.on("message", async ({username, role, text})=>{

            io.emit("message",{
                username,
                role,
                text,
                type: role==="Lecturer"
                    ? "announcement"
                    : "response",
                time:new Date().toLocaleTimeString()
            });

        });

        socket.on("disconnect", async ()=>{

            const user = await userStore.getUser(socket.id);

            await userStore.removeUser(socket.id);

            io.emit("users", await userStore.getUsers());

            if(user){

                io.emit("message",{
                    username:"System",
                    role:"System",
                    text:`${user.username} left the system.`,
                    type:"system",
                    time:new Date().toLocaleTimeString()
                });

            }

            console.log(`[${serverName}] Disconnected: ${socket.id}`);

        });

    });

};
