import getCookie from "../components/cookies"

export default function useRestoreChats(setCachedUsers, setLoadedChats, setAllMessages) {
    async function restoreChats() {
        const token = getCookie("token")
        const username = getCookie("username")
        const res = await fetch("/api/acc-info", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, token })
        })
        if (!res.ok) return
        const userData = await res.json()

        const chats = []
        const messagesMap = {}
        const cachedUsers = {}

        const channelPromises = (userData.channels || []).map(async (channel) => {
            const res = await fetch("/api/full-channel-info", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ channelID: channel.channelID, token })
            })

            if (!res.ok) return
            
            const channelInfo = await res.json()
            
            if (channelInfo.channelName?.length > 15) channelInfo.channelName = channelInfo.channelName.slice(0, 15) + " ..."

            channelInfo.id = channel.channelID
            channelInfo.type = "channel"
            
            chats.push(channelInfo)

            if (channelInfo.messages) {
                messagesMap[channel.channelID] = channelInfo.messages
                for (const message of channelInfo.messages) {
                    if (!cachedUsers[message.userID]) {
                        const userRes = await fetch("/api/acc-info-by-id", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ id: message.userID })
                        })
                        const userInfo = await userRes.json()
                        cachedUsers[message.userID] = { username: userInfo.username, avatar: userInfo.avatar }
                    }
                }
            }
        })

        const pmPromises = (userData.pms || []).map(async (pmID) => {
            const res = await fetch("/api/pm-info", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ PM: pmID, token })
            })
            if (!res.ok) return
            const pmInfo = await res.json()
            messagesMap[pmInfo.id] = pmInfo.messages || []

            for (const memberID of pmInfo.members) {
                if (!cachedUsers[memberID]) {
                    const userRes = await fetch("/api/acc-info-by-id", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ id: memberID })
                    })
                    const userInfo = await userRes.json()
                    cachedUsers[memberID] = { username: userInfo.username, avatar: userInfo.avatar }
                }
            }

            const otherMembers = pmInfo.members.filter(id => id !== userData.id)
            const pmName = otherMembers.map(id => cachedUsers[id]?.username || "PM").join(", ")
            const pmAvatar = otherMembers.map(id => cachedUsers[id]?.avatar || "/default.png")[0] || "/default.png"

            chats.push({ id: pmInfo.id, name: pmName, avatar: pmAvatar, type: "pm"})
        })

        await Promise.all([...channelPromises, ...pmPromises])

        setCachedUsers(cachedUsers)
        setLoadedChats(chats)
        setAllMessages(messagesMap)
    }

    return restoreChats
}