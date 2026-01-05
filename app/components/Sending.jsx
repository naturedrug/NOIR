// components/Sending.js
'use client'

import css from "../styles/sending.module.css"
import Image from "next/image"
import imageInputSvg from "../../public/fileInput.svg"
import socket from "../socket"
import getCookie from "./cookies"
import { useState, useRef } from "react"
import { useUser } from "../contexts/UserContext"

export default function Sending({ onMessageSent }) {
    const [fileInput, setFileInput] = useState(null)
    const inputRef = useRef(null)

    const user = useUser()

    function typing(e) {
        socket.emit("inputing", {
            token: getCookie("token"),
            room: getCookie("room")
        })

        if (e.key == "Enter") {
            sending()
        }
    }

    async function sending() {
        const textValue = inputRef.current?.value || ""

        if (!textValue && !fileInput) return;

        const messageData = {
            token: getCookie("token"),
            text: textValue,
            media: fileInput || undefined,
            avatar: user.avatar,
            username: user.username,
            at: Date()
        }

        // if (fileInput) {
        //     const arrayBuffer = await fileInput.arrayBuffer()
        //     const uint8Array = new Uint8Array(arrayBuffer)
        //     messageData.media = uint8Array
        //     onMessageSent(textValue, uint8Array)
        // } else {
        //     onMessageSent(textValue, undefined)
        // }



        socket.emit("send_message", messageData, `chat:${getCookie("room")}`)

        if (inputRef.current) {
            inputRef.current.value = ""
        }
        setFileInput(null)
    }

    return (
        <div className={css.sending}>
            <input
                ref={inputRef}
                className={css.messageInput}
                autoComplete="off"
                onKeyDown={(e) => typing(e)}
            />
            <label className={css.imageInputLabel}>
                <Image src={imageInputSvg} alt="file input"></Image>
                <input
                    type="file"
                    name="image"
                    id="sendImage"
                    className={css.imageInput}
                    onChange={(e) => setFileInput(e.target.files[0])}
                />
            </label>
        </div>
    )
}