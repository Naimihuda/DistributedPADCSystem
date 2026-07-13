const USER_KEY = "connected_users";

function createUserStore(redisClient){

    async function addUser(socketId, username, role, server){

        const user = {
            socketId,
            username,
            role,
            server
        };

        await redisClient.hSet(
            USER_KEY,
            socketId,
            JSON.stringify(user)
        );

        return user;
    }

    async function removeUser(socketId){
        await redisClient.hDel(USER_KEY, socketId);
    }

    async function getUser(socketId){
        const data = await redisClient.hGet(USER_KEY, socketId);
        return data ? JSON.parse(data) : null;
    }

    async function getUsers(){
        const data = await redisClient.hGetAll(USER_KEY);
        return Object.values(data).map(value => JSON.parse(value));
    }

    async function clearUsers(){
        await redisClient.del(USER_KEY);
    }

    return {
        addUser,
        removeUser,
        getUser,
        getUsers,
        clearUsers
    };

}

module.exports = createUserStore;