import css from "../styles/header.module.css"

import socket from "../socket"
import getCookie from "./cookies"

import useMic from "../hooks/useMic"

import { useEffect } from "react"

export default function Header({ channelName, channelAvatar, channelMembers, type }) {

    useEffect(() => {
        const audioContext = new AudioContext()
        let nextPlayTime = 0

        socket.on("get_audio_packet", async (buffer) => {

            if (!buffer || buffer.byteLength === 0) return

            const data = new Float32Array(buffer)

            if (audioContext.state === "suspended") {
                await audioContext.resume()
            }

            const audioBuffer = audioContext.createBuffer(
                1,
                data.length,
                audioContext.sampleRate
            )

            audioBuffer.copyToChannel(data, 0)

            const source = audioContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(audioContext.destination)

            if (nextPlayTime < audioContext.currentTime) {
                nextPlayTime = audioContext.currentTime
            }

            source.start(nextPlayTime)
            nextPlayTime += audioBuffer.duration
        })

        return () => socket.off("get_audio_packet")
    }, [])


    let membersOut = channelMembers

    if (channelMembers) {
        if (membersOut >= 1000 && membersOut < 1000000) {

            membersOut /= 1000

            membersOut = membersOut.toFixed(1)

            membersOut = String(membersOut)
            membersOut += "K"
        }

        if (membersOut >= 1000000) {
            membersOut /= 1000000

            membersOut = membersOut.toFixed(1)

            membersOut += "M"
        }

    }

    function gocall() {
        useMic(socket, getCookie("room"))
    }


    return (
        <div className={css.header}>
            <div style={{ display: (channelName == undefined) ? "none" : "flex" }} className={css.headerContainer}>

                <img src={channelAvatar} alt="avatar" className={css.headerChannelAvatar} />
                <p className={css.headerChannelName}>

                    {channelName}
                    <br></br>


                    {(type == "channel") ? <span className={css.headerChannelMembers}>members: {membersOut}</span> : undefined}

                </p>
            </div>

            <button onClick={gocall}>Call</button>
        </div>
    )
}