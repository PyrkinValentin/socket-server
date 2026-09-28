import type http from "http"

import { Server } from "socket.io"
import { createClient } from "redis"
import { createAdapter } from "@socket.io/redis-adapter"

import { APP_BASE_URL, APP_REDIS_URL } from "../constants"

export const createSocketServer = <
	Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
	Response extends typeof http.ServerResponse<InstanceType<Request>> = typeof http.ServerResponse,
>(server: http.Server<Request, Response>) => {
	const socketServer = new Server(server, {
		maxHttpBufferSize: 1e4,
		pingInterval: 60000,
		pingTimeout: 30000,
		transports: ["websocket"],
		cors: {
			origin: APP_BASE_URL,
			methods: ["GET", "POST"],
		},
	})

	const pubClient = createClient({ url: APP_REDIS_URL })
	const subClient = pubClient.duplicate()

	Promise.all([pubClient.connect(), subClient.connect()])
		.then(() => {
			socketServer.adapter(createAdapter(pubClient, subClient))
			console.log("Socket.io successfully connected to Redis adapter")
		})
		.catch((err) => {
			console.error("Redis adapter connection failed: ", err)
			process.exit(1)
		})

	return socketServer
}