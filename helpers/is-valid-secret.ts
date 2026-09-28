import { APP_SECRET_KEY } from "../constants"

export const isValidSecret = (secret: unknown) => {
	return !!secret && secret === APP_SECRET_KEY
}