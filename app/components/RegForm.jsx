'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import css from "../styles/auth.module.css"

export default function RegForm({redirectTo}) {
    const router = useRouter()

    async function submit(e) {
        e.preventDefault()

        if (passwordField !== confirmField) {
            return alert("Пароли не совпадают")
        }

        let response = await fetch(`/api/reg`, {
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
        }
    }

    const [loginField, setLoginField] = useState("")
    const [passwordField, setPasswordField] = useState("")
    const [confirmField, setConfirmField] = useState("")

    return (
        <div className={css.authForm}>
            <form className={css.regForm} onSubmit={(e) => submit(e)}>
                <input type="text" placeholder="login" required id="login" autoComplete="off" className={css.formInput} onChange={(e) => setLoginField(e.target.value)}></input>
                <input type="password" placeholder="password" required id="password" autoComplete="off" className={css.formInput} onChange={(e) => setPasswordField(e.target.value)}></input>
                <input type="password" placeholder="confirm password" required id="confirmPassword" autoComplete="off" className={css.formInput} onChange={(e) => setConfirmField(e.target.value)} />
                <input type="submit" value="Create account" className={css.submit}></input>
            </form>
            <a href="/auth">Already have account?</a>
        </div>
    )
}