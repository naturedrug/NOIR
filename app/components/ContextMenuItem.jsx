'use client'

import { useEffect, useState } from "react"
import css from "../styles/contextMenuItem.module.css"

import getCookie from "./cookies"


const itemsForMessages = ["Delete message"]

export default function ContextMenuItem({ role, target }) {

    const [itsMessage, setItsMessage] = useState(false)

    useEffect(() => {

        if (target) {

            const parent = target.parentElement
    
            let messageID;
    
            if (target.dataset.id && target.dataset.testid == "msg") {
                messageID = target.dataset.id
            }
    
            if (parent.dataset.id && parent.dataset.testid == "msg") {
                messageID = parent.dataset.id
            }
    
            if (messageID) {
                setItsMessage(true)
            } else {
                setItsMessage(false)
            }
        }

    }, [target])

    async function onClick(e) {
        e.stopPropagation()

        const parent = target.parentElement

        switch (role) {

            case "Copy":
                const selected = window.getSelection().toString()


                // console.log("target:", target)
                // console.log("parent:", parent)

                navigator.clipboard.writeText(selected)

                break;

            case "Delete message":
                let messageID;

                if (target.dataset.id && target.dataset.testid == "msg") {
                    messageID = target.dataset.id
                }

                if (parent.dataset.id && parent.dataset.testid == "msg") {
                    messageID = parent.dataset.id
                }

                if (messageID) {
                    console.log("delete")

                    let response = await fetch("/api/delete-message", {
                        method: "POST",
                        headers: {"content-type": "application/json"},
                        body: JSON.stringify({
                            token: getCookie("token"),
                            id: messageID
                        })
                    })

                    response = await response.json()

                    console.log(response)
                }

            default:
                break;
        }
    }

    if (itemsForMessages.includes(role) && !itsMessage) {
        return null
    }

    return (
        <div className={css.contextMenuItem} onMouseDown={(e) => onClick(e)} data-m={itsMessage}>
            <span style={{ color: (role == "Delete message") ? "rgb(220,45,45)" : "white" }}>{role}</span>
        </div>
    )
}