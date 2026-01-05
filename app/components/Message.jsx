import css from "../styles/message.module.css"

import Link from "next/link"


export default function Message({ text, media, username, avatar }) {
    return (
        <div className={css.message}>
            <div className={css.messageContainer}>
                <img src={avatar} className={css.avatar}></img>
                <Link className={css.username} href={`/users/${username}`} >{username}</Link>
                {(media) ? <img src={media} alt="media" className={css.messageMedia} /> : undefined}
            </div>
            <p>{text}</p>
        </div>
    )
}