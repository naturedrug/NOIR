// hooks/useMessages.js
import { useState, useEffect, useRef } from "react";
import socket from "../socket";
import getCookie from "../components/cookies";

export default function useMessages(user, setCachedUsers) {
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const messagesRefs = useRef([]);

  useEffect(() => {
    if (!user) return;

    const handler = (message) => {
      if (message.room === `chat:${getCookie("room")}`) {
        setMessages((prev) => [...prev, message]);
      }

      if (message.user) {
        setCachedUsers((prev) => ({
          ...prev,
          [message.userID]: message.user,
        }));
      }

      setAllMessages((prev) => {
        const channelId = message.room.slice(5);
        const channelMsgs = prev[channelId] || [];
        return { ...prev, [channelId]: [...channelMsgs, message] };
      });
    };

    socket.on("server_send_message", handler);
    return () => socket.off("server_send_message", handler);
  }, [user]);

  return { messages,  allMessages, setAllMessages, messagesRefs, setMessages };
}
