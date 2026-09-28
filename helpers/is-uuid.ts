import type { Uuid } from "../types"

export const isUuid = (uuid: unknown): uuid is Uuid => {
	if (typeof uuid === "string") {
		return uuid.trim() !== ""
	}

	if (typeof uuid === "number") {
		return Number.isFinite(uuid)
	}

	if (Array.isArray(uuid)) {
		return uuid.length > 0 && uuid.every(isUuid)
	}

	return false
}