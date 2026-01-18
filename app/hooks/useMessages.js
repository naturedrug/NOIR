// hooks/useMessages.js
import { useState, useEffect, useRef } from "react";
import socket from "../socket";
import getCookie from "../components/cookies";

export default function useMessages(user, setCachedUsers) {
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const messagesRefs = useRef([]);

  const audioRef = useRef(null)

  useEffect(() => {
    if (!user) return;

    const audioSrc = "/message.mp3"

    audioRef.current = new Audio(audioSrc)

    const handler = (message) => {
      if (message.room === `chat:${getCookie("room")}`) {
        setMessages((prev) => [...prev, message]);
      } else {
        audioRef.current.play()
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

    socket.on("del-msg-server", ({ message, room }) => {
      const id = message.id
      
      setAllMessages((prev) => {

        // console.log(prev)

        const out = prev;

        const outMessages = out[room]

        const index = outMessages.findIndex((m) => m.id === id)

        if (index > -1) { // not -1 !
          outMessages.splice(index, 1)
          out[room] = outMessages
        }

        return { ...out };
      });
      
      setMessages((prev) => {

        let index = prev.findIndex((m) => m.id == id)
      
        if (index != -1) {
          return prev.splice(prev.findIndex((m) => m.id == id), 1)
        } else {
          return prev;
        }



      })


      // console.log("DELETE " + id)
    })

    return () => socket.off("server_send_message", handler);
  }, [user]);

  return { messages, allMessages, setAllMessages, messagesRefs, setMessages };
}
