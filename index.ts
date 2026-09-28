import express from "express"
import http from "http"
import dotenv from "dotenv"

import { Server, Socket } from "socket.io"

dotenv.config()

const app = express()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
	cors: {
		origin: process.env.BASE_URL,
		methods: ["GET", "POST"],
	},
})

app.use(express.json())

const noop = () => {
}

process.on("unhandledRejection", noop)
process.on("uncaughtException", noop)

io.on("connection", (socket: Socket) => {
	socket.on("join", (uuid) => socket.join(uuid))

	socket.on("broadcast", (payload) => {
		if (payload.secret !== process.env.SECRET_KEY) {
			return socket.disconnect(true)
		}

		io
			.to(payload.uuid)
			.emit(payload.event, payload.data)
	})
})

httpServer.listen(process.env.PORT)