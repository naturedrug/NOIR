'use client'

import Image from "next/image"
import closeSvg from "../../public/close.svg"

import css from "../styles/newchannelprompt.module.css"

import Channels from "./channels"
import getCookie from "./cookies"
import { useState } from "react"



export default function NewChannelPrompt({ display, closeF }) {
    
    const [fileInput, setFileInput] = useState(null)
    const [channelName, setChannelName] = useState("")

    async function createChannel() {
        const formData = new FormData()

        formData.append("token", getCookie("token"))
        formData.append("channelName", channelName)
        formData.append("avatar", fileInput)

        let response = await fetch("/api/new-channel", { method: "POST", body: formData });
        response.json().then(() => {
            closeF()
            Channels.joinChannel(channelName, getCookie("username"), getCookie("token"), () => {
                window.location.reload()
            });
        });
    }

    return (
        <div className={css.createNewChannel} style={{ display: display }}>
            <input type="file" accept="image/*" name="avatar" id="channelAvatar" onChange={(e) => setFileInput(e.target.files[0])}></input>
            <input placeholder="Название канала" name="channelName" id="channelName" autoComplete="off" onChange={(e) => setChannelName(e.target.value)}></input>
            <button id="createChannelButton" onClick={createChannel}>Создать</button>
            <Image width={32} height={32} src={closeSvg} alt="close" className={css.closeCreateNewChannel} onClick={closeF}></Image>
        </div>
    )
}