/**
 * This is a file created solely as a means to explore and test working with the evoliz API.
 * It is NOT MEANT for usage outside of this package.
 * DO NOT USE IT
 */
import { loginManager, api, Logger } from '../evoliz.mjs'
import { makeFakeDB, Client } from './fakeDB.mjs'

export default function createTest({
	public_key,
	secret_key,
	dbFilePath,
	logger
}: {
	public_key: string
	secret_key: string,
	dbFilePath: string,
	logger: Logger
}) {
	const login = loginManager({ public_key, secret_key, logger })

	const fakeDB = makeFakeDB(dbFilePath)

	const { createClient, registerInvoice, ...rest } = api({ login, logger })

	/**
	 * Links the evoliz client creation to ours
	 * @param internalClientId Our own client ID in our database
	 * @param name The client's name
	 */
	const createOrGetClient = async (internalClientId: string, name: string, email: Email) => {
		logger.info(`Fetching client`)
		const internalClient = await fakeDB.getOrCreate(internalClientId, name, email)
		if (
			'evolizClientId' in internalClient &&
			internalClient.evolizClientId > 0
		) {
			logger.info(`Client has evolizId, using that`)
			return internalClient
		}

		logger.log(`Client does not exist, creating a new one`)
		const { clientid } = await createClient({ name })
		logger.log(`Evoliz client created, clientid is\n${clientid}`)
    const client: Client = { name, email, evolizClientId: clientid }
		await fakeDB.set(internalClientId, client) 
		return client
	}

	/**
	 * Testing if creating an invoice works
	 */
	const test = async () => {
    const client = await createOrGetClient('some-id', 'someone', `someone@somemail.com`)
		registerInvoice({
			external_document_number: `doc-id-${Math.random()}-${Date.now()}`,
			clientid: client.evolizClientId,
      clientEmail: client.email,
			label: 'bought a thing',
			term:{
				paytermid:17
			},
			items: [
				{
					reference: 'SPLIT',
					designation: 'Banana Split <br />\nPour une durée de 12 mois',
					quantity: 12.5,
					unit_price_vat_exclude: 30.25,
				},
			],
		})
	}

	return {test, ...rest};
}
