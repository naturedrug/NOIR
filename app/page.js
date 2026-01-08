'use client'
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Sending from "./components/Sending";
import NewChannelPrompt from "./components/NewChannelPrompt";
import Message from "./components/Message";
import Preloader from "./components/Preloader";
import Image from "next/image";
import newChatSvg from "../public/newChat.svg";

import { UserContext } from "./contexts/UserContext";

import useCurrentUser from "./hooks/useCurrentUser";
import useMessages from "./hooks/useMessages";
import useMessageObserver from "./hooks/useObserver";

import css from "./page.module.css"

export default function Home() {
  const router = useRouter();
  const user = useCurrentUser(router);

  const contentRef = useRef(null);
  const mainContentRef = useRef(null);

  const [newChannelPromptDisplay, setNewChannelPromptDisplay] = useState("none");

  const [cachedUsers, setCachedUsers] = useState({})

  const { messages, allMessages, setAllMessages, messagesRefs, setMessages } = useMessages(user, setCachedUsers);
  const visibleMessages = useMessageObserver(messages, messagesRefs, contentRef);

  const dummyRef = useRef(null)

  const [messagesDOM, setMessagesDOM] = useState()
  
  useEffect(() => {
    dummyRef.current.scrollIntoView({ behavior: "smooth", block: "end" })

  }, [messages])

  return (
    <UserContext.Provider value={user}>
      <div className="page">
        <div className="container">
          <Header />
          <Sidebar
            onMessagesChanged={setMessages}
            setAllMessages={setAllMessages}
            allMessages={allMessages}
            setCachedUsers={setCachedUsers}
          />
          <div onClick={() => setNewChannelPromptDisplay("flex")}>
            <Image src={newChatSvg} alt="new chat" />
          </div>
          <div className={css.mainContent} ref={mainContentRef}>
            <div className={css.content} ref={contentRef}>
              <Preloader />
              {messages.map((message, index) => {
                return <Message
                  key={message.id}
                  id={message.id}
                  ref={(el) => (messagesRefs.current[message.id] = el)}
                  text={message.text}
                  media={message.media}
                  username={cachedUsers[message.userID]?.username}
                  avatar={cachedUsers[message.userID]?.avatar}
                  at={message.at}
                  read={visibleMessages.has(message.id)}
                  prev={(messages[index - 1]) ? messages[index - 1] : undefined}
                />
              })}
              <div style={{ marginTop: "75px" }} ref={dummyRef}></div>
            </div>
            <Sending />
          </div>
          <NewChannelPrompt display={newChannelPromptDisplay} closeF={() => setNewChannelPromptDisplay("none")} />
        </div>
      </div>
    </UserContext.Provider>
  );
}
