import css from "../styles/sidebar.module.css"
import newChatSvg from "../../public/newChat.svg"
import { useEffect, useState, useCallback } from "react"
import getCookie from "./cookies"
import Channel from "./Channel"
import { useUser } from "../contexts/UserContext"

export default function Sidebar({ onMessagesChanged, setAllMessages, allMessages, setCachedUsers }) {
    const [loadedChats, setLoadedChats] = useState([])

    const user = useUser()

    useEffect(() => {
        restoreChats()
    }, [])

    const chats = []

async function restoreChats() {
    let userRes = await fetch("/api/acc-info", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            username: getCookie("username"),
            token: getCookie("token")
        })
    });

    let user = await userRes.json();

    if (!user.channels || user.channels.length === 0) return;

    const chats = [];
    const messagesMap = {}; // { chatId: messages[] }


    const promises = user.channels.map(async (channel) => {
        let channelRes = await fetch("/api/full-channel-info", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                channelID: channel.channelID,
                token: getCookie("token")
            })
        });

        let channelInfo = await channelRes.json();


        if (channelInfo.channelName && channelInfo.channelName.length > 15) {
            channelInfo.channelName = channelInfo.channelName.slice(0, 15) + " ...";
        }

        channelInfo.id = channel.channelID;

        chats.push(channelInfo);

        if (channelInfo.messages) {
            messagesMap[channel.channelID] = channelInfo.messages;

            const cachedUsers = {}

            channelInfo.messages.forEach(async (message) => {


                if (!cachedUsers[message.userID]) {



                    let response = await fetch("/api/acc-info-by-id", {
                        method: "POST",
                        headers: {"content-type": "application/json"},
                        body: JSON.stringify({
                            id: message.userID
                        })
                    })

                    response = await response.json()

                    cachedUsers[message.userID] = {
                        username: response.username,
                        avatar: response.avatar
                    }

                }

                setCachedUsers(cachedUsers)

            })


        }
    });

    await Promise.all(promises);

    setLoadedChats(chats);
    console.log(messagesMap)
    setAllMessages(messagesMap);
}

    const handleChannelClick = useCallback(async (messages) => {
        if (messages && messages.length > 0) {

            onMessagesChanged(messages)
        } else {
            onMessagesChanged([])
        }
    }, [onMessagesChanged])

    return (
        <div className={css.sidebar}>
            {loadedChats.map((chat, index) => (
                <Channel
                    key={index}
                    onMessagesChanged={handleChannelClick}
                    id={chat.channelID}
                    name={chat.channelName}
                    avatar={chat.avatar}
                    messages={ allMessages[chat.channelID] }
                />
            ))}
        </div>
    )
}