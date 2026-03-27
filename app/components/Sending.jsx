'use client'

import css from "../styles/sending.module.css"
import Image from "next/image"

import imageInputSvg from "../../public/fileInput.svg"
import smileSvg from "../../public/smile.svg"

import socket from "../socket"
import getCookie from "./cookies"
import { useState, useRef } from "react"
import { useUser } from "../contexts/UserContext"
import SmileBar from "./SmileBar"
import LoadedFile from "./LoadedFile"

export default function Sending({ onMessageSent }) {
    const [fileInput, setFileInput] = useState(null)
    const [fileBase64, setFileBase64] = useState("")
    const inputRef = useRef(null)

    const [smilebarDisplay, setSmilebarDisplay] = useState("none")
    const user = useUser()
    let isTyping = false

    function setIsTyping(value) {
        if (value === true && isTyping === false) {
            isTyping = true
            const timeout = setTimeout(() => {
                isTyping = false
            }, 1500)
            clearTimeout(timeout)
        }
    }

    function typing(e) {
        setIsTyping(true)
        if (isTyping === true) {
            socket.emit("typing", getCookie("token"), getCookie("room"))
        }
        if (e.key == "Enter") sending()
    }

    async function sending() {
        const textValue = inputRef.current?.value || ""
        if (!textValue && !fileInput) return

        const messageData = {
            token: getCookie("token"),
            text: textValue,
            media: fileInput || undefined,
            avatar: user.avatar,
            username: user.username,
            at: Date()
        }

        socket.emit("send_message", messageData, `chat:${getCookie("room")}`)

        if (inputRef.current) inputRef.current.value = ""
        setFileInput(null)
        setFileBase64("")
    }

    function inputSmile(smile) {
        inputRef.current.value += smile
    }

    function smileBtnOnclick() {
        setSmilebarDisplay(smilebarDisplay === "none" ? "flex" : "none")
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (!file) return

        setFileInput(file)

        const reader = new FileReader()
        reader.onload = () => {
            setFileBase64(reader.result)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className={css.sending}>
            <input
                ref={inputRef}
                className={css.messageInput}
                autoComplete="off"
                onKeyDown={(e) => typing(e)}
            />
            <button className={css.smileBtn} onClick={smileBtnOnclick}>
                <Image src={smileSvg} alt="smiles"></Image>
            </button>
            <label className={css.imageInputLabel}>
                <Image src={imageInputSvg} alt="file input"></Image>
                <input
                    type="file"
                    name="image"
                    id="sendImage"
                    className={css.imageInput}
                    onChange={handleFileChange}
                />
            </label>
            {fileInput && (
                <LoadedFile
                    fileName={fileInput.name}
                    fileImgData={fileBase64}
                />
            )}
            <SmileBar inputSmile={inputSmile} display={smilebarDisplay}></SmileBar>
        </div>
    )
}