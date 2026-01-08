import express from 'express'
import next from 'next'
import apiRoutes from "./routes/api.js"
import { Server } from 'socket.io';
import http from "http"
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs"
import cookie from "cookie"
import bcrypt from "bcrypt"
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join("db", "db.json")


const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static(path.join(__dirname, "uploads")));
    app.use("/media", express.static(path.join(__dirname, "public")))
    app.use("/api", apiRoutes);

    app.post("/api/acc-info", async (req, res) => {
        const db = await fs.promises.readFile(dbPath, "utf-8");

        const dbParsed = JSON.parse(db);

        const bodyParsed = req.body

        const user = dbParsed.users.find((u) => bodyParsed.username === u.username);

        const isTokenValid = await bcrypt.compare(bodyParsed.token, user.token);

        if (isTokenValid) {
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(500);
            res.end(undefined);
        }
    });

    app.post("/api/acc-info-by-id", async (req, res) => {
        const db = await fs.promises.readFile(dbPath, "utf-8");

        const dbParsed = JSON.parse(db);

        const bodyParsed = req.body;

        const user = dbParsed.users.find((u) => bodyParsed.id == u.id);

        // ONLY PUBLIC INFO


        if (user) {
            console.log("acc-info-by-id is ok")
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ username: user.username, avatar: user.avatar })); // maybe avatar and other acc info
        } else {
            console.log("acc-info-by-id is not ok")
            res.writeHead(500);
            res.end(undefined);
        }
    });


    const server = http.createServer(app)

    const io = new Server(server)

    io.on('connection', async (socket) => {
        const databaseConn = await fs.promises.readFile(dbPath, 'utf-8')
        const dbParsedConn = JSON.parse(databaseConn)

        socket.data.currentRoom = null

        const parsedCookies = cookie.parse(socket.handshake.headers.cookie)

        let findedUser;

        if (!parsedCookies.token) {
            return console.log("don't have a token")
        }

        for (const user of dbParsedConn.users) {
            const valid = await bcrypt.compare(parsedCookies.token, user.token)

            if (valid) {
                findedUser = user
            }
        }

        if (!findedUser) {
            return console.log("WARN: DON'T FIND THIS USER!");

        }

        socket.join(`user:${findedUser.id}`)

        console.log("JOINED TO " + `user:${findedUser.id}`)

        findedUser.channels.forEach(channel => {
            socket.join(`chat:${channel.channelID}`)
        });

        console.log('client connected:', socket.id);

        socket.on("new-pm", (senderID, userID, PMID) => {

            io.to(`user:${userID}`).emit("new-pm-client", senderID, PMID)

        })

        /* message object
          {
              media : string,
              text : string,
              userID : string
          }
      
          */

        socket.on("change-room", async (token, roomId) => {
            if (!token || !roomId) return;

            // auth
            const database = await fs.promises.readFile(dbPath, 'utf-8')
            const dbParsed = JSON.parse(database)

            const user = dbParsed.users.find(u => bcrypt.compareSync(token, u.token))
            if (!user) return;




            socket.join(`chat:${roomId}`)
            socket.data.currentRoom = `chat:${roomId}`

            console.log("CHANGED TO", socket.data.currentRoom)
        })



        socket.on("send_message", async (message, roomId) => {
            // console.log(`
            // GETTING MESSAGE

            // media: ${message.media},
            // text: ${message.text},
            // token: ${message.token}
            //         `);

            console.log("processing msg from: ", roomId);

            const db = await fs.promises.readFile(dbPath, "utf-8");

            const dbParsed = JSON.parse(db);

            let haveThisUser = false;
            let userID = null;
            let sender;

            for (const user of dbParsed.users) {
                const match = await bcrypt.compare(message.token, user.token);
                if (match) {
                    haveThisUser = true;
                    userID = user.id;
                    sender = user;
                    break;
                }
            }

            if (!haveThisUser) {
                console.log("don't really user");
                return;
            }

            let isUserHaveThisChannel = false;

            if (sender.channels) {
                for (const channel of sender.channels) {
                    if (channel.channelID == roomId.slice(5)) {
                        isUserHaveThisChannel = true
                    }
                }
            }


            let isUserHaveThisPM = false;

            if (sender.pms) {
                for (const PM of dbParsed.pms) {

                    if (PM.members.includes(sender.id)) {

                        isUserHaveThisPM = true;
                    }
                }
            }


            if (!isUserHaveThisChannel && !isUserHaveThisPM) {
                console.log("user don't have this channel or PM (server listener)")
                return
            }

            // sending below

            const mediaID = nanoid(25)
            if (message.media) {
                const media = Buffer.from(message.media)


                await fs.promises.writeFile(path.join(__dirname, "uploads", `${mediaID}.jpg`), media)
            }


            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const time = {
                day: now.getDate(),
                month: now.getMonth(),
                hours: hours,
                minutes: minutes
            }


            const newMessage = {
                media: (message.media) ? `/static/${mediaID}.jpg` : undefined,
                text: message.text,
                userID: userID,
                id: nanoid(20),
                at: time
            };

            const channelFromDB = dbParsed.channels.find((c) => roomId.slice(5) === c.channelID)

            if (!channelFromDB) {
                const PMFromDB = dbParsed.pms.find((pm) => pm.id === roomId.slice(5))

                if (!PMFromDB) return;

                if (!PMFromDB.messages) {
                    PMFromDB.messages = []
                }


                PMFromDB.messages.push(newMessage);

                await fs.promises.writeFile(
                    dbPath,
                    JSON.stringify(dbParsed, null, 2),
                    "utf-8"
                );

                console.log(`TO ${roomId}`)

                newMessage.room = roomId

                newMessage.user = {
                    username: sender.username,
                    avatar: sender.avatar
                }

                io.to(roomId).emit("server_send_message", newMessage);
            } else {

                if (!channelFromDB.messages) {
                    channelFromDB.messages = []
                }

                channelFromDB.messages.push(newMessage);

                await fs.promises.writeFile(
                    dbPath,
                    JSON.stringify(dbParsed, null, 2),
                    "utf-8"
                );

                console.log(`TO ${roomId}`)

                newMessage.room = roomId
                newMessage.user = {
                    username: sender.username,
                    avatar: sender.avatar
                }

                io.to(roomId).emit("server_send_message", newMessage);
            }

        });

        socket.on("inputing", ({ room }) => {


            if (!findedUser) return;

            socket.to(room).emit("inputing-server", findedUser.username)
        })

        socket.on('disconnect', () => {
            console.log('client disconnected:', socket.id);
        });
    });

    app.use((req, res) => {
        if (!req.path.startsWith("/api")) {
            return handle(req, res);
        }
    });


    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
})