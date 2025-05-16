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

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      return {
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        text: msg?.text,
        createdAt: msg?.createdAt,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, createdAt }) => {
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, text, createdAt },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return; // prevent sending empty
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto border-4 border-blue-900 rounded-2xl m-5 h-[70vh] flex flex-col"
      style={{ maxWidth: "100%" }}
    >
      <h1 className="p-5 border-b border-gray-600 text-center text-xl font-semibold">
        Chat
      </h1>
      <div className="flex-1 overflow-y-auto p-5 max-h-[60vh]">
        {messages?.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                "chat " +
                (user.firstName === msg.firstName ? "chat-end" : "chat-start")
              }
              style={{ wordBreak: "break-word", maxWidth: "100%" }}
            >
              <div className="chat-header flex flex-wrap justify-between gap-1">
                {`${msg.firstName} ${msg.lastName}`}
                <time className="text-xs opacity-50 whitespace-nowrap">
                  {dayjs(msg.createdAt).fromNow()}
                </time>
              </div>
              <div className="chat-bubble max-w-full">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex flex-col sm:flex-row items-center gap-3">
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          className="flex-1 border border-gray-500 text-black font-sans font-bold rounded p-2 bg-blue-400"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="btn btn-secondary w-full sm:w-auto"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
