import css from "../styles/sidebar.module.css"
import { useEffect, useState, useCallback, useRef } from "react"
import Channel from "./Channel"
import useRestoreChats from "../hooks/useRestoreChats"

import socket from "../socket"

const MIN_WIDTH = 90
const MAX_WIDTH = 400

export default function Sidebar({
  onMessagesChanged,
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
    },
    [onMessagesChanged]
  )

  useEffect(() => {
    socket.on("new-pm-client", () => {
      console.log("123123")
    })
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
        />
      ))}
    </div>
  )
}
