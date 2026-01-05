'use client'

import css from "../styles/profile.module.css"

import { useEffect, useState } from "react"
import getCookie from "./cookies"

import { useRouter } from "next/navigation"

export default function ProfileMine({ user }) {


    const router = useRouter()

    const [settingsDisplay, setSettingsDisplay] = useState("none")

    const [fileInput, setFileInput] = useState(null)
    const [nameInput, setNameInput] = useState("")

    const [avatarURL, setAvatarURL] = useState(" ")

    useEffect(() => {
        const username = getCookie("username")
        if (username) {setNameInput(username)}

        setAvatarURL(`${user.avatar}?t=${Date.now()}`)
            
        
    }, [])


    function openSettings() {
        setSettingsDisplay("flex")
    }

    function closeSettings() {
        setSettingsDisplay("none")
    }

    async function changeAccountData() {
        const formData = new FormData();

        const newUsername = nameInput;

        formData.append("token", getCookie("token"))
        formData.append("username", getCookie("username"))

        if (newUsername) {
            formData.append("newUsername", newUsername)
        }

        if (fileInput) {
            if (nameInput)
                formData.append("newAvatar", fileInput, `${nameInput}.jpg`)
        }


        let response = await fetch("/api/change-account-data", {
            method: "POST",
            body: formData
        })

        response = await response.json()

        if (response.success) {


            if (newUsername) {
                router.replace(`/users/${newUsername}`)
            }

        }
    }

    return (
        <div>
            <div className={css.container}>
                <div className={css.profile}>
                    <div className={css.avatar}>
                        <img src={avatarURL} />
                        <span className={css.bio}>{user.bio || ""}</span>
                    </div>
                    <h2 className={css.username}>{user.username}</h2>
                    <div className={css.dataChange} onClick={openSettings}>
                        <img src="/media/settings.svg" alt="settings"></img>
                    </div>
                </div>
            </div>
            <div className={css.settings} style={{ display: settingsDisplay }}>
                <img src="/media/close.svg" alt="close" className={css.closeSettings} onClick={closeSettings}></img>

                <div className={css.options}>
                    <button className="option account">Account</button>
                </div>
                <div className={css.values}>
                    <div className="accountValues valuesContainer">
                        <h3>Имя пользователя</h3>
                        <input type="text" className={css.value} id="usernameValue" value={nameInput} autoComplete="off" onChange={(e) => setNameInput(e.target.value)}></input>
                        <h3>Аватар</h3>
                        <input type="file" className={css.value} id="avatarValue" onChange={(e) => setFileInput(e.target.files[0])}></input>
                    </div>
                    <button className={css.confirmButton} onClick={changeAccountData}>Подтвердить</button>
                </div>
            </div>
        </div>
    )
}