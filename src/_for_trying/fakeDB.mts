/**
 * This is a file created solely as a means to explore and test working with the evoliz API.
 * It is NOT MEANT for usage outside of this package.
 * DO NOT USE IT
 */
import { writeFileSync, readFileSync, mkdtempSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
export interface Client {
	name: string
	email: Email
	evolizClientId: number
}

//5013927

const openDbFile = <T extends Record<any, unknown>>(dbFilePath: string, defaultData: T) => {
	if (!existsSync(dbFilePath)) {
		return writeDBFile(dbFilePath, defaultData)
	}
	const data = JSON.parse(readFileSync(dbFilePath, { encoding: 'utf-8' })) as T
	return data
}

const writeDBFile = <T extends Record<any, unknown>>(dbFilePath: string, defaultData: T) => {
	writeFileSync(dbFilePath, JSON.stringify(defaultData))
	return defaultData
}

const createDefaultFilePath = (prefix = `${Math.random()}`) =>
	join(mkdtempSync(join(tmpdir(), `evoliz-temp-${prefix}`)), 'db.json')

export const makeFakeDB = (dbFilePath = createDefaultFilePath('def')) => {

	const wait = (timeout = 0.1) => new Promise((ok) => setTimeout(ok, timeout))

	const db = openDbFile(dbFilePath, {} as Record<string, Client>)

	const get = (client_id: string) => wait().then(() => db[client_id])

	const has = (client_id: string) => wait().then(() => client_id in db)

	const set = (client_id: string, client: Client) =>
		wait().then(() => {
			db[client_id] = client
			writeDBFile(dbFilePath, db)
			return client
		})

	const getOrCreate = (client_id: string, name: string, email: Email) =>
		has(client_id).then((exists) => {
			if (exists) {
				return get(client_id)
			}
			const client = { name, email, evolizClientId: -1 }
			return set(client_id, client)
		})

	return { get, has, set, getOrCreate }
}
