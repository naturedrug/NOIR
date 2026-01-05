import Image from "next/image"

import messageSvg from "../../public/message.svg"

import css from "../styles/profile.module.css"

export default function ProfileIsntMine({user}) {
    return (
        <div>
            <div className={css.container}>
                <div className={css.profile}>
                    <div className={css.avatar}>
                        <img
                            src={user.avatar || 'http://localhost:9999/media/people.png'}
                            alt="Аватар пользователя"
                        />
                        <span className={css.bio}>{user.bio || ""}</span>
                    </div>
                    <h2 className={css.username}>{user.username}</h2>
                    <div className={css.addFriend}>
                        <Image src={messageSvg} width={64} height={64} alt="message icon"></Image>
                    </div>
                </div>
            </div>
        </div>
    )
}