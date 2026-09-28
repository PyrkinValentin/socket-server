import "dotenv/config"

import express from "express"
import http from "http"

import { createSocketServer } from "./libs"
import { createRoom } from "./utils"
import { isUuid, isValidSecret } from "./helpers"

import { APP_PORT } from "./constants"

const app = express()
const httpServer = http.createServer(app)
const socketServer = createSocketServer(httpServer)

process.on("unhandledRejection", (reason) => {
	console.error("Unhandled Rejection: ", reason)
	process.exit(1)
})

process.on("uncaughtException", (error) => {
	console.error("Uncaught Exception: ", error)
	process.exit(1)
})

app.use(express.json())

app.post("/api/broadcast", (req, res) => {
	const {
		secret,
		uuid,
		event,
		data,
	} = req.body

	if (!isValidSecret(secret)) {
		res
			.status(401)
			.json({ error: "Unauthorized App" })

		return
	}

	if (!isUuid(uuid) || !event) {
		res
			.status(400)
			.json({ error: "Missing/invalid uuid or missing event" })

		return
	}

	socketServer
		.to(createRoom(uuid))
		.emit(event, data)

	res
		.status(200)
		.json({ success: true })

	return
})

socketServer.on("connection", (socket) => {
	socket.on("join", (uuid) => {
		if (isUuid(uuid)) {
			socket.join(createRoom(uuid))
		}
	})
})

httpServer.listen(APP_PORT, () => {
	console.log(`Server running on port ${APP_PORT}`)
})