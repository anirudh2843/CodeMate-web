import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { socket } from "../utils/socket";

dayjs.extend(relativeTime);

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [chatId, setChatId] = useState(null);

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  // ✅ Fetch target user details
  const fetchTargetUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/user/${targetUserId}`, {
        withCredentials: true,
      });
      setTargetUser(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn("⚠️ User not found");
        setTargetUser({ firstName: "Unknown", lastName: "" });
      } else {
        console.error("Failed to fetch target user info", err);
      }
    }
  };

  // ✅ Fetch messages from backend
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });
      setChatId(chat.data._id);

      const chatMessages = chat?.data?.messages.map((msg) => ({
        _id: msg._id,
        chatId: chat.data._id,
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        text: msg?.text,
        createdAt: msg?.createdAt,
        senderId: msg?.senderId?._id,
        image: msg.image ? true : false,
      }));

      setMessages(chatMessages || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  // ✅ Load target user & messages on refresh
  useEffect(() => {
    // fetchTargetUser();
    fetchChatMessages();
  }, [targetUserId]);

  // ✅ Socket join & real-time updates
  useEffect(() => {
    if (!userId || !targetUserId || !user) return;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: msg._id,
          chatId: msg.chatId, // ✅ Now available for images
          firstName: msg.firstName,
          lastName: msg.lastName,
          text: msg.text,
          createdAt: msg.createdAt,
          senderId: msg.senderId,
          image: msg.image,
        },
      ]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("messageReceived");
      socket.off("onlineUsers");
      socket.emit("leaveChat", { userId });
    };
  }, [userId, targetUserId, user?.firstName]);

  // ✅ Send message (text/image)
  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    if (newMessage.trim()) formData.append("text", newMessage);
    if (selectedFile) formData.append("image", selectedFile);

    try {
      const res = await axios.post(
        `${BASE_URL}/chat/${targetUserId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const savedMessage = res?.data?.messages?.slice(-1)[0];

      if (savedMessage) {
        socket.emit("sendMessage", {
          _id: savedMessage._id, // ✅ Add message ID
          chatId: res.data._id || chatId,
          firstName: user.firstName,
          lastName: user.lastName,
          text: savedMessage.text,
          createdAt: savedMessage.createdAt,
          senderId: savedMessage.senderId._id || savedMessage.senderId,
          image: !!savedMessage.image,
        });
      }

      setNewMessage("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const isTargetOnline = onlineUsers.includes(targetUserId);

  return (
    <div className="w-full max-w-6xl mx-auto border-4 border-blue-900 rounded-2xl m-5 h-[70vh] flex flex-col">
      {/* Header with Online Status */}
      <h1 className="p-5 border-b border-gray-600 text-center text-xl font-semibold flex items-center justify-center gap-3">
        {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Chat"}
        {isTargetOnline ? (
          <span className="text-green-400 text-sm">● Online</span>
        ) : (
          <span className="text-gray-400 text-sm">● Offline</span>
        )}
      </h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 max-h-[60vh] min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={`${msg.createdAt}-${index}`}
              className={`chat ${
                userId === (msg.senderId?._id || msg.senderId)
                  ? "chat-end"
                  : "chat-start"
              }`}
            >
              <div className="chat-header flex justify-between">
                <span>{msg.senderId === userId ? "You" : msg.firstName}</span>
                <time className="text-xs opacity-50">
                  {dayjs(msg.createdAt).fromNow()}
                </time>
              </div>
              <div className="chat-bubble max-w-full">
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img
                    src={`${BASE_URL}/${msg.chatId}/image/${msg._id}`} // ✅ Guaranteed chatId now
                    alt="uploaded"
                    className="mt-2 max-w-xs rounded cursor-pointer hover:opacity-90"
                    onClick={() =>
                      setPreviewImage(
                        `${BASE_URL}/${msg.chatId}/image/${msg._id}`
                      )
                    }
                  />
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-3xl max-h-[90vh] rounded shadow-lg"
          />
        </div>
      )}

      {/* Input */}
      <div className="p-5 border-t border-gray-600 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
          className="flex-1 border border-gray-500 text-black font-sans font-bold rounded p-2 bg-blue-400"
          placeholder={loading ? "Sending..." : "Type your message..."}
        />
        <button
          onClick={sendMessage}
          disabled={loading || (!newMessage.trim() && !selectedFile)}
          className="btn btn-secondary"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
