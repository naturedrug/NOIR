import { io } from "socket.io-client";
import serverConfig from "@/serverConfig";


const socket = io(`http://${serverConfig.hostname}:${serverConfig.port}`)

export default socket