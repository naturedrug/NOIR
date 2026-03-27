'use client'

import { useState } from "react";
import socket from "../socket";

import css from "../styles/typingbar.module.css"

export default function TypingBar() {

    // by name
    const [typingStr, setTypingStr] = useState("")


    const [display, setDisplay] = useState("block")

    const typingUsers = new Set()

    const MAX_USERS = 2

    function formingStrAndUpdateState() {

        const users = Array.from(typingUsers)

        let outputStr = ""

        if (users.length > MAX_USERS) {

            for (let i = 0; i < MAX_USERS; i++) {
                outputStr += users[i]

                if (users[users.length - 1] != users[i]) {
                    outputStr += ", "
                }
            }


            outputStr = outputStr.slice(-2)
            outputStr += "..."

            outputStr += " печатает"
        } else {
            users.forEach((user) => {

                outputStr += user

                if (users[users.length - 1] != user) {
                    outputStr += ", "
                }

            })
            outputStr += " печатает"
        }

        if (!users) {
            setDisplay("none")
        }


        if (outputStr == " печатает") {
            setTypingStr("")

        } else {

            setTypingStr(outputStr)
        }


    }




    socket.on("typing-server", (name) => {



        typingUsers.add(name)

        formingStrAndUpdateState()

        const timeout = setTimeout(() => {
            typingUsers.delete(name)
            formingStrAndUpdateState()

            clearTimeout(timeout)
        }, 1500)


    })

    return (
        <div className={css.typingbar} style={{ display: display }}>
            <span>
                {typingStr}
            </span>
        </div>
    )

}