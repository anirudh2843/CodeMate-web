import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { socket } from "../utils/socket";

const NotificationListener = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    // Join personal notification room
    socket.emit("joinChat", { userId: user._id, firstName: user.firstName });

    // Listen for notifications
    socket.on("messageNotification", ({ senderId, senderName, message }) => {
      toast.info(`💬 ${senderName}: ${message}`, {
        position: "top-right",
        autoClose: false,
        closeButton: true,
        onClick: () => navigate(`/chat/${senderId}`),
      });
    });

    return () => {
      socket.off("messageNotification");
    };
  }, [user?._id, navigate]);

  return null;
};

export default NotificationListener;
