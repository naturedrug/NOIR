'use client'

import css from "../styles/contextMenuItem.module.css"

import Image from "next/image"

export default function ContextMenuItem({ role, icon, target }) {
    function onClick(e) {
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

                console.log(messageID)

            default:
                break;
        }
    }

    return (
        <div className={css.contextMenuItem} onMouseDown={(e) => onClick(e)}>
            <span>{role}</span>
            <Image src={icon} alt="icon"></Image>
        </div>
    )
}