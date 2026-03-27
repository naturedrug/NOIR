'use client'

import { useEffect, useRef, useState } from "react"
import css from "../styles/callmembers.module.css"
import socket from "../socket"

export default function CallMembers() {

    const [members, setMembers] = useState(new Set())
    const [membersInfo, setMembersInfo] = useState({})

    const ref = useRef(null)

    useEffect(() => {
        const handlerJoin = (id, newMembers) => {


            setMembers(new Set(newMembers))

        }
        
        const handlerLeave = (id) => {

            

            setMembers((prev) => {
                const newSet = new Set(prev)

                newSet.delete(id)

                return newSet
            })

        }

        socket.on("new_member_call", handlerJoin)

        socket.on("leave_call", handlerLeave)

        return () => {
            socket.off("new_member_call", handlerJoin)
            socket.off("leave_call", handlerLeave)
        }
    }, [])


    useEffect(() => {
        const loadMembersInfo = async () => {
            const idsToLoad = [...members].filter(id => !membersInfo[id])
            if (!idsToLoad.length) return

            try {
                const results = await Promise.all(
                    idsToLoad.map(async (id) => {
                        const res = await fetch("/api/acc-info-by-id", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ id })
                        })
                        const data = await res.json()
                        return [id, data]
                    })
                )

                setMembersInfo(prev => {
                    const copy = { ...prev }
                    results.forEach(([id, data]) => {
                        copy[id] = data
                    })
                    return copy
                })
            } catch (e) {
                console.error("Ошибка загрузки участников", e)
            }
        }

        loadMembersInfo()
    }, [members])

    return (
        <div className={css.callmembers} ref={ref}>
            {[...members].map(member => {
                const info = membersInfo[member]
                if (!info) return null



                return (
                    <div key={member} data-userid={member} className={css.member}>
                        <img src={info.avatar} alt="avatar" />
                    </div>
                )
            })}

            <span className={css.numMembers}>{members.size || ""}</span>
        </div>
    )
}
