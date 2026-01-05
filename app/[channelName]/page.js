'use server'

import Image from "next/image";

import bcrypt from "bcrypt"
import path from "path";
import fs from "fs"
import { fileURLToPath } from "url"

import Channels from "../components/channels";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "..", "db", "db.json")

const db = await fs.promises.readFile(dbPath, 'utf-8')

const dbParsed = JSON.parse(db)



import css from "../styles/channelPage.module.css"
import NotFound from "../components/NotFound";
import ChannelInviting from "../components/ChannelInviting";

export default async function Page({ params }) {

    const slug = await params;

    const channelName = slug.channelName

    const cookieStore = await cookies()

    const token = cookieStore.get("token")
    const username = cookieStore.get("username")

    if (!token || !username) {
        redirect("/auth")
    }

    const channel = dbParsed.channels.find((c) => decodeURI(c.name) === decodeURI(channelName))

    if (channel) {
        return (

            <ChannelInviting channelAvatar={channel.avatar} channelID={channel.channelID} channelName={channel.name}></ChannelInviting>


        )
    } else {
        return (
            <NotFound error={`don't found ${channelName} channel`}></NotFound>
        )
    }

}