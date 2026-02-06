import css from "../styles/sidebar.module.css"
import { useEffect, useState, useCallback, useRef } from "react"
import Channel from "./Channel"
import useRestoreChats from "../hooks/useRestoreChats"

import socket from "../socket.js"

const MIN_WIDTH = 90
const MAX_WIDTH = 400

export default function Sidebar({
  onMessagesChanged,
  onChannelChanged,
  setAllMessages,
  allMessages,
  setCachedUsers,
  setContentPadd
}) {
  const [loadedChats, setLoadedChats] = useState([])
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [sidebarW, setSidebarW] = useState(100)

  const resizeRef = useRef(null)

  const restoreChats = useRestoreChats(
    setCachedUsers,
    setLoadedChats,
    setAllMessages
  )

  useEffect(() => {
    restoreChats()
  }, [])


  const handleMouseMove = useCallback(
    (e) => {
      if (!isMouseDown) return

      const nextWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, e.clientX)
      )

      setContentPadd(nextWidth - 90)

      setSidebarW(nextWidth)
    },
    [isMouseDown]
  )

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const handleChannelClick = useCallback(
    (messages) => {
      onMessagesChanged(messages?.length > 0 ? messages : [])
    }
    ,
    [onMessagesChanged]
  )

useEffect(() => {
  const handler = async (senderID, pmID) => {
    console.log("new pm: ", { sender: senderID, PM: pmID })

    let response = await fetch("/api/acc-info-by-id", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: senderID })
    })

    response = await response.json()

    setLoadedChats(prev => [
      ...prev,
      { id: pmID, name: response.username, avatar: response.avatar }
    ])
  }

  socket.on("new-pm-client", handler)

  return () => {
    socket.off("new-pm-client", handler)
  }
}, [])


  return (
    <div className={css.sidebar} style={{ width: `${sidebarW}px` }}>
      <div
        className={css.sidebarResize}
        ref={resizeRef}
        onMouseDown={() => setIsMouseDown(true)}
      />

      {loadedChats.map((chat) => (
        <Channel
          key={chat.id}
          id={chat.id}
          name={chat.name}
          avatar={chat.avatar}
          messages={allMessages[chat.id]}
          onMessagesChanged={handleChannelClick}
          onChannelChanged={onChannelChanged}
          members={chat.membersVal}
          type={chat.type}
        />
      ))}
    </div>
  )
}
