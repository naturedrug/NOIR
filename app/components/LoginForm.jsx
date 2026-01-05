'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import css from "../styles/auth.module.css"

export default function LoginForm({redirectTo}) {
    const router = useRouter()

    async function submit(e) {
        e.preventDefault()

        let response = await fetch(`/api/auth`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                username: loginField,
                password: passwordField
            })
        })

        response = await response.json()

        if (response.success) {
            router.replace(redirectTo)
        } else {
            alert("Неверный логин или пароль")
        }
    }

    const [loginField, setLoginField] = useState("")
    const [passwordField, setPasswordField] = useState("")

    return (
        <div className={css.authForm}>
            <form className={css.loginForm} onSubmit={(e) => submit(e)}>
                <input type="text" placeholder="login" required id="login" autoComplete="off" className={css.formInput} onChange={(e) => setLoginField(e.target.value)}></input>
                <input type="password" placeholder="password" required id="password" autoComplete="off" className={css.formInput} onChange={(e) => setPasswordField(e.target.value)}></input>
                <input type="submit" value="Login" className={css.submit}></input>
            </form>
            <a href="/reg">Don't have account?</a>
        </div>
    )
}