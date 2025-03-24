import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState("Alice");

    useEffect(() => {
        socket.emit("join_chat", currentUser);

        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        }); 

        return () => socket.off("receive_message");
    }, [currentUser]);

    const sendMessage = () => {
        if (message.trim() === "") return;

        const newMessage = { sender: currentUser, message };
        socket.emit("send_message", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
                
                <div className="flex items-center justify-between rounded-t-lg bg-green-500 p-4 text-white">
                    <h2 className="text-lg font-bold"> Chat App</h2>
                    <select
                        className="rounded bg-green-400 px-2 py-1 text-white focus:outline-none"
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                    >
                        <option value="Alice">Alice</option>
                        <option value="Bob">Bob</option>
                    </select>
                </div>

                
                <div className="h-80 overflow-y-auto p-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-2 flex ${
                                msg.sender === currentUser ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`rounded-lg px-4 py-2 shadow-md ${
                                    msg.sender === currentUser
                                        ? "bg-blue-500 text-white text-right"
                                        : "bg-gray-300 text-black text-left"
                                }`}
                            >
                                <span className="font-bold">{msg.sender}:</span> {msg.message}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="flex border-t p-4 bg-white">
                    <input
                        type="text"
                        className="flex-1 rounded-lg border px-3 py-2 text-black hover:bg-green-400 transition duration-200"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className="ml-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-200 hover:bg-green-700"
                        onClick={sendMessage}
                    >
                        Send 
                    </button>
                </div>
            </div>
        </div>
    );
}
