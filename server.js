const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const users = {}; // Store connected users

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Assign a username (Alice/Bob)
    socket.on("join_chat", (username) => {
        users[socket.id] = username;
        console.log(`${username} joined the chat`);
        io.emit("update_users", Object.values(users)); // Send updated user list
    });

    // Handle message sending
    socket.on("send_message", (data) => {
        console.log(`Message from ${data.sender}: ${data.message}`);
        io.emit("receive_message", data); // Send message to everyone
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`${users[socket.id]} disconnected`);
        delete users[socket.id];
        io.emit("update_users", Object.values(users));
    });
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});
