const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

async function setupRedis(io) {

    const pubClient = createClient({
        url: "redis://127.0.0.1:6379"
    });

    const subClient = pubClient.duplicate();

    pubClient.on("error", (err) => {
        console.error("Redis Publisher Error:", err);
    });

    subClient.on("error", (err) => {
        console.error("Redis Subscriber Error:", err);
    });

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));

    console.log("✅ Redis Adapter Connected");

    return {
        pubClient,
        subClient
    };
}

module.exports = setupRedis;