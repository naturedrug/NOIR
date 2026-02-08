'use client'

import css from "../styles/channel.module.css"

import socket from "../socket"
import getCookie from "./cookies"
import { useEffect } from "react";

export default function Channel({ id, name, avatar, messages, onMessagesChanged, onChannelChanged, members, type }) {


    const handleClick = () => {

        document.cookie = `room=${id}; path=/; max-age=86400`;
        socket.emit("change-room", getCookie("token"), id);

        onMessagesChanged(messages || []);

        onChannelChanged({ name: name, avatar: avatar, members: members, type: type })
    };

    useEffect(() => {
        if (getCookie("room") == id) {
            onMessagesChanged(messages || []);
    
            onChannelChanged({ name: name, avatar: avatar, members: members, type: type })
        }
    }, [])


    return (
        <div className={css.channel} onClick={handleClick}>
            <h3 className={css.channelName}>{name}</h3>
            <img src={avatar} alt="channel avatar" className={css.channelAvatar} />
        </div>
    )
}