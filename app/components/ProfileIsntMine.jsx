'use client'

import Image from "next/image"

import messageSvg from "../../public/message.svg"

import css from "../styles/profile.module.css"
import socket from "../socket"


import { useRouter } from "next/navigation"
import getCookie from "./cookies"

export default function ProfileIsntMine({ user }) {

    const router = useRouter()

    async function newPM() {
        let response = await fetch("/api/new-pm", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                token: getCookie("token"),
                friendID: user.id
            })
        })



        response = await response.json()

        let personalUser = await fetch("/api/acc-info", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                token: getCookie("token"),
                username: getCookie("username")
            })
        })

        personalUser = await personalUser.json()

        if (response.success) {
            socket.emit(user.id, personalUser.id, response.PMID)

            router.replace("/")
        }
    }

    return (
        <div>
            <div className={css.container}>
                <div className={css.profile}>
                    <div className={css.avatar}>
                        <img
                            src={user.avatar || '/media/people.png'}
                            alt="Аватар пользователя"
                        />
                        <span className={css.bio}>{user.bio || ""}</span>
                    </div>
                    <h2 className={css.username}>{user.username}</h2>
                    <div className={css.addFriend} onClick={newPM}>
                        <Image src={messageSvg} width={64} height={64} alt="message icon"></Image>
                    </div>
                </div>
            </div>
        </div>
    )
}