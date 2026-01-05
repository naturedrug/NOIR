'use client'

import css from "../styles/channelPage.module.css"

import Channels from "./channels"
import getCookie from "./cookies"

import { useRouter } from "next/navigation"

export default function ChannelInviting({ channelID, channelName, channelAvatar }) {
    const router = useRouter()

    function joinChannel() {
        Channels.joinChannel(channelID, getCookie("username"), getCookie("token"), () => {
            router.replace("/")
        })
    }

    return (

        <div className={css.channelBlock}>
            <h2 className={css.channelTitle}>{channelName}</h2>
            <img src={channelAvatar} alt="channel avatar" className={css.channelAvatar}></img>
            <button className={css.join} onClick={joinChannel}>Присоедениться</button>
        </div>


    )
}