import type { Uuid } from "../types"

export const createRoom = (uuid: Uuid) => {
	return Array.isArray(uuid)
		? uuid.map(String)
		: String(uuid)
}