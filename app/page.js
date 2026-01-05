
'use client'

import styles from "./page.module.css"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Sending from "./components/Sending"
import NewChannelPrompt from "./components/NewChannelPrompt"
import Image from "next/image"
import newChatSvg from "../public/newChat.svg"

import { useEffect, useState, useCallback, useRef } from "react"

import Preloader from "./components/Preloader"
import getCookie from "./components/cookies"
import { useRouter } from "next/navigation"
import Message from "./components/Message"
import socket from "./socket"
import { UserContext } from "./contexts/UserContext"

export default function Home() {
  const router = useRouter()

  const [newChannelPromptDisplay, setNewChannelPromptDisplay] = useState("none")
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [cachedUsers, setCachedUsers] = useState({})
  const [allMessages, setAllMessages] = useState({})

  const contentRef = useRef(null)
  const notificationRef = useRef(null)

  useEffect(() => {
    notificationRef.current = new Audio("/message.mp3")
    notificationRef.current.volume = 0.5
  }, [])

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch("/api/acc-info", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token: getCookie("token"),
          username: getCookie("username")
        })
      })
      const userData = await response.json()
      setUser(userData)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    if (!getCookie("token") || !getCookie("username")) {
      router.replace("/auth")
    } else {
      fetchCurrentUser()
    }
  }, [router, fetchCurrentUser])

  useEffect(() => {
    if (!user) return

    const handler = (message) => {
      if (message.room === `chat:${getCookie("room")}`) {
        setMessages(prev => [...prev, message])
      }

      if (message.user) {
        setCachedUsers(prev => ({
          ...prev,
          [message.userID]: message.user
        }))
      }

      if (message.userID !== user.id) {
        notificationRef.current?.play()
      }

      setAllMessages(prev => {
        const channelId = message.room.slice(5)
        const channelMsgs = prev[channelId] || []
        return {
          ...prev,
          [channelId]: [...channelMsgs, message]
        }
      })
    }

    socket.on("server_send_message", handler)
    return () => socket.off("server_send_message", handler)
  }, [user])

  useEffect(() => {
    contentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    })
  }, [messages])

  function closePrompt() {
    setNewChannelPromptDisplay("none")
  }

  return (
    <UserContext.Provider value={user}>
      <div className={styles.page}>
        <div className="container">
          <Header />
          <Sidebar
            onMessagesChanged={setMessages}
            setAllMessages={setAllMessages}
            allMessages={allMessages}
            setCachedUsers={setCachedUsers}
          />
          <div
            className={styles.newChat}
            onClick={() => setNewChannelPromptDisplay("flex")}
          >
            <Image src={newChatSvg} alt="new chat" />
          </div>

          <div className={styles.mainContent}>
            <div className={styles.content}>
              <Preloader />
              {messages.map((message, index) => (
                <Message
                  key={index}
                  text={message.text}
                  media={message.media}
                  username={cachedUsers[message.userID]?.username}
                  avatar={cachedUsers[message.userID]?.avatar}
                />
              ))}
              <div />
            </div>
            <Sending />
            <div className="dummy" ref={contentRef} />
          </div>

          <NewChannelPrompt
            display={newChannelPromptDisplay}
            closeF={closePrompt}
          />
        </div>
      </div>
    </UserContext.Provider>
  )
}

