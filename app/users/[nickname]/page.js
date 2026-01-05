import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt"

import NotFound from "@/app/components/NotFound";
import { cookies } from "next/headers";
import LoginForm from "@/app/components/LoginForm";
import ProfileMine from "@/app/components/ProfileMine";
import ProfileIsntMine from "@/app/components/ProfileIsntMine";
import { UserContext } from "@/app/contexts/UserContext";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "..", "..", "db", "db.json")


export default async function Users({params}) {
    const slug = await params;
    const nickname = slug.nickname;

    const database = await fs.promises.readFile(dbPath, 'utf-8')
    const dbParsed = JSON.parse(database)

    const cookieStore = cookies()
    const token = (await cookieStore).get("token")?.value

    if (!token) {
        return <LoginForm redirectTo={`/users/${nickname}`}></LoginForm>
    }

    const user = dbParsed.users.find((u) => decodeURI(u.username) == decodeURI(nickname))

    if (!user) {

        return (
            
            <NotFound error={`unknown user ${nickname}`}></NotFound>
            
        )
    }

    const isTokenValid = await bcrypt.compare(token, user.token);

    const openUserInfo = {
        username: user.username,
        avatar: user.avatar,
        id: user.id,
    } // without password and token for safe
    
    return (isTokenValid)
    ?
    <ProfileMine user={openUserInfo}></ProfileMine>
    :
    <ProfileIsntMine user={openUserInfo}></ProfileIsntMine>
}