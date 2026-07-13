const users = [];

// Add or update a connected user
function addUser(socketId, username, role, server) {
    // Remove existing user with the same username (refresh/reconnect)
    const existing = users.findIndex(
        user => user.username === username
    );

    if (existing !== -1) {
        users.splice(existing, 1);
    }

    const user = {
        socketId,
        username,
        role,
        server
    };

    users.push(user);

    return user;
}

// Remove user when disconnected
function removeUser(socketId) {
    const index = users.findIndex(
        user => user.socketId === socketId
    );

    if (index !== -1) {
        users.splice(index, 1);
    }
}

// Return all connected users
function getUsers() {
    return users;
}

// Find one user
function getUser(socketId) {
    return users.find(
        user => user.socketId === socketId
    );
}

module.exports = {
    addUser,
    removeUser,
    getUsers,
    getUser
};