import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  // Fetch initial chat messages
  const fetchChatMessages = async () => {
    if (!targetUserId) return;
    
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => ({
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        text: msg?.text,
        createdAt: msg?.createdAt,
        senderId: msg?.senderId?._id,
      }));
      
      setMessages(chatMessages || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  // Initialize chat messages on component mount
  useEffect(() => {
    if (targetUserId && user) {
      fetchChatMessages();
    }
  }, [targetUserId, user]);

  // Setup socket connection
  useEffect(() => {
    if (!userId || !targetUserId || !user) {
      return;
    }

    const newSocket = createSocketConnection();

    // Join the chat room
    newSocket.emit("joinChat", {
      firstName: user?.firstName || "Unknown",
      userId,
      targetUserId,
    });

    // Listen for incoming messages
    newSocket.on("messageReceived", ({ firstName, lastName, text, createdAt, senderId }) => {
      const newMessage = {
        firstName,
        lastName,
        text,
        createdAt,
        senderId,
      };
      
      // Add all messages to UI (including your own from other devices/tabs)
      setMessages((prev) => [...prev, newMessage]);
    });

    // Handle connection errors
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [userId, targetUserId, user?.firstName]);

  // Send message function
  const sendMessage = async () => {
    if (newMessage.trim() === "" || loading || !socket || !user) return;

    const messageText = newMessage.trim();
    setLoading(true);
    
    try {
      // Send message to backend
      const response = await axios.post(
        `${BASE_URL}/chat/${targetUserId}`,
        { text: messageText },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const savedMessage = response?.data?.messages?.slice(-1)[0];
      
      if (savedMessage) {
        // Emit message via socket (backend will broadcast to all clients)
        socket.emit("sendMessage", {
          firstName: user?.firstName || "Unknown",
          lastName: user?.lastName || "User",
          userId,
          targetUserId,
          text: messageText,
          createdAt: savedMessage.createdAt,
          senderId: userId,
        });
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto border-4 border-blue-900 rounded-2xl m-5 h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-2">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto border-4 border-blue-900 rounded-2xl m-5 h-[70vh] flex flex-col"
      style={{ maxWidth: "100%" }}
    >
      <h1 className="p-5 border-b border-gray-600 text-center text-xl font-semibold">
        Chat
      </h1>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-5 max-h-[60vh]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={`${msg.createdAt}-${index}`}
              className={
                "chat " +
                (user?.firstName === msg.firstName ? "chat-end" : "chat-start")
              }
              style={{ wordBreak: "break-word", maxWidth: "100%" }}
            >
              <div className="chat-header flex flex-wrap justify-between gap-1">
                <span>{`${msg.firstName} ${msg.lastName}`}</span>
                <time className="text-xs opacity-50 whitespace-nowrap">
                  {dayjs(msg.createdAt).fromNow()}
                </time>
              </div>
              <div className="chat-bubble max-w-full">{msg.text}</div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-5 border-t border-gray-600 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          className="flex-1 border border-gray-500 text-black font-sans font-bold rounded p-2 bg-blue-400 disabled:opacity-50"
          placeholder={loading ? "Sending..." : "Type your message..."}
          maxLength={1000}
        />
        <button
          onClick={sendMessage}
          disabled={loading || newMessage.trim() === ""}
          className="btn btn-secondary w-full sm:w-auto disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;