import express from "express"
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"
import bcrypt from "bcrypt"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "db", "db.json");

const router = express.Router();

import { io } from "../server.js";



router.post("/delete-message", async (req, res) => {

    if (!req.body.id || !req.body.token) {
        return res.end(JSON.stringify({
            error: "don't have enough data (/api/delete-message)"
        }))
    }

    const db = await fs.promises.readFile(dbPath, 'utf-8')

    const dbParsed = JSON.parse(db)

    let matchedUser;

    for (const user of dbParsed.users) {
        const match = await bcrypt.compare(req.body.token, user.token)

        if (match) {
            matchedUser = user;
            break;
        }
    }

    if (!matchedUser) {
        return res.end(JSON.stringify({
            error: "don't have user with this token (/api/delete-message)"
        }))
    }

    let finded;
    let room;

    for (const channel of dbParsed.channels) {

        let matchIndex = channel.messages.findIndex((msg) => msg.id === req.body.id)
        let match = channel.messages.find((msg) => msg.id === req.body.id)

        if (matchIndex != -1) {
            channel.messages.splice(matchIndex, 1)
            finded = match
            room = channel.channelID
            console.log("matched, index: " + matchIndex)
        }
    }

    for (const channel of dbParsed.pms) {

        let matchIndex = channel.messages.findIndex((msg) => msg.id === req.body.id)
        let match = channel.messages.find((msg) => msg.id === req.body.id)

        if (matchIndex != -1) {
            channel.messages.splice(matchIndex, 1)
            finded = match
            room = channel.id
            console.log("matched, index: " + matchIndex)
        }
    }

    if (finded && finded.userID === matchedUser.id) {
        if (finded.media) {
            const filename = finded.media.slice(8)

            const pathto = path.join(__dirname, "..", "uploads", filename)

            await fs.promises.unlink(pathto)
            console.log(`> remove img ${pathto} from server`)
        }

        await fs.promises.writeFile(dbPath, JSON.stringify(dbParsed, null, 2), 'utf-8')

        // console.log("EMIT TO " + room, "MSG: " + req.body.id)

        io.to(`chat:${room}`).emit("del-msg-server", {
            message: finded,
            room: room
        })

        return res.end(JSON.stringify({
            success: true
        }))

    } else {
        console.log("NOT FINDED OR CAN'T DELETE (/api/delete-message)")
        return res.end(JSON.stringify({
            error: "don't have this message or can't delete (/api/delete-message)"
        }))
    }

})

export default router