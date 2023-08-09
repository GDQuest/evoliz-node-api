import { join } from 'path'

export const today = () => new Date().toISOString().split('T')[0] as DateAsStr

const parseJsonResponse = async (resp: Response) => {
	const json = await resp.json()
	if (resp.status >= 400) {
		const dataAsStr = JSON.stringify(json, null, 2)
		const errorStr = `Status \`${resp.status}:${resp.statusText}\` while accessing ${resp.url}\n${dataAsStr}`
		throw new Error(errorStr)
	}
	return json
}
export interface Logger {
	info: (typeof console)['info']
	log: (typeof console)['log']
	error: (typeof console)['error']
	warn: (typeof console)['warn']
}
export interface EvolizLoginConfig {
	public_key: string
	secret_key: string
	urlBase?: string
	logger?: Logger
}
export interface EvolizAPIConfig {
	version?: string
	urlBase?: string
	login: () => Promise<string>
	logger?: Logger
}

const urlDefault = `https://www.evoliz.io/api`

const defaultLogger: Logger = {
	info(..._data: any[]) {},
	log(..._data: any[]) {},
	warn(..._data: any[]) {},
	error(..._data: any[]) {},
}

/**
 *
 * Creates a login function that keeps its own expiration date saved.
 * This allows to only request a new token when necessary.
 */
export const loginManager = ({
	public_key,
	secret_key,
	urlBase = urlDefault,
	logger = defaultLogger,
}: EvolizLoginConfig) => {
	let prevExpires = new Date()
	let accessToken = ''

	const hasExpired = () => {
		const expired = !accessToken || new Date() >= prevExpires
		logger.info(`Login expired: ${expired}`)
		return expired
	}

	const freshLogin = () => {
		const url = `${urlBase}/login`
		const data = { public_key, secret_key }
		logger.info(
			`refreshing login at ${url} with ${JSON.stringify(data, null, 2)}`
		)
		return fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(parseJsonResponse)
			.then(({ expires_at, access_token }: Evoliz.LoginResponse) => {
				prevExpires = new Date(expires_at)
				accessToken = access_token
				logger.info(`Access Token Acquired`)
				return access_token
			})
	}

  /**
   * If the token has expired (or there's no token), does a fresh login. Otherwise,
   * returns the token
   */
	const login = () => {
		const _hasExpired = hasExpired()
		if (_hasExpired) {
			logger.log(`Requesting fresh login...`)
			return freshLogin()
		}
		return Promise.resolve(accessToken)
	}

  /**
   * Logins once, and returns the login function. Can be used to ensure logging in is possible
   * prior to using the API
   */
	const ensureValid = () => login().then(() => (login))

	login.ensureValid = ensureValid 
	return login
}

export const api = ({
	login,
	version = 'v1',
	urlBase = urlDefault,
	logger = defaultLogger,
}: EvolizAPIConfig) => {

  /**
   * Proxy around `fetch` that prepends the evoliz url and sets the provided
   * token in the `Authorization` header.
   * It assumes JSON data is sent
   *
   */ 
	const fetchEvolizAPI = (
		accessToken: string,
		path: string,
		data: any,
		additional?: Partial<RequestInit>
	) => {
		const url = join(urlBase, version, path)
		const method = additional?.method ? additional.method : 'POST'
		const body = data && method === 'POST' ? JSON.stringify(data) : undefined
		logger.info(`--------------------------------\n[${path.toUpperCase()}]\nFetching ${method}: ${url}`, data)
		return fetch(url, {
			method,
			...additional,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...additional?.headers,
			},
			body
		})
	}

  /**
   * Augments `fetchEvolizAPI` by ensuring `login()` is called before, and the token is valid.
   * It assumes JSON data is received, and deems any http status over 400 to be an error.
   * @see {fetchEvolizAPI}
   * @see {parseJsonResponse}
   */
	const evolizRequest = (
		url: string,
		data: any,
		additional?: Partial<RequestInit>
	) =>
		login()
			.then((accessToken) => fetchEvolizAPI(accessToken, url, data, additional))
			.then(parseJsonResponse)

	const createClient = ({
		name,
		type = 'Particulier',
		address = {
			postcode: '0000',
			town: 'Random town',
			iso2: 'FR',
		},
	}: Partial<Evoliz.ClientRequest> & {
		name: Evoliz.ClientRequest['name']
	}): Promise<Evoliz.Client> =>
		evolizRequest(`clients`, {
			name,
			type,
			address,
		})

	const createSaleOrder = ({
		external_document_number,
		clientid,
	}: Evoliz.SaleOrderRequest): Promise<Evoliz.SaleOrderResponse> =>
		evolizRequest(`sale-orders`, {
			external_document_number, // "EXT001" must be unique
			documentdate: today(), //"2019-10-10"
			clientid, // 9876,
		})

	const createInvoice = ({
		external_document_number,
		clientid,
		term,
		items
	}: Evoliz.InvoiceCreateRequest): Promise<Evoliz.InvoiceResponse> =>
		evolizRequest(`invoices`, {
			external_document_number,
			documentdate: today(),
			clientid,
			term,
			items
		})

	const payInvoice = (
		invoiceid: number,
		{ label = 'Some payement', amount }: Evoliz.InvoicePayRequest
	) =>
		evolizRequest(join(`invoices`, `${invoiceid}`, `payments`), {
			paydate: today(),
			label,
			paytypeid: 4, // WHAT IS THIS?
			amount, // WHERE DOES THIS COME FROM?
		})

	/**
	 *
	 * @param invoiceid The invoide Draft Invoice Id
	 */
	const saveInvoice = (invoiceid: number) =>
		evolizRequest(join(`invoices`, `${invoiceid}`, `create`), {})

	const sendInvoiceByEmail = async (
		invoiceid: number,
		data: Evoliz.InvoiceSendByEmailRequest
	) => {
		evolizRequest(join(`invoices`, `${invoiceid}`, `send`), data)
	}

	const getPaymentTerms = async () =>
		evolizRequest(`payterms`, null, { method: 'GET' })


	type InvoiceRegisterRequest = {
		label: Evoliz.InvoicePayRequest['label']
		external_document_number: Evoliz.SaleOrderRequest['external_document_number']
		clientid: Evoliz.SaleOrderRequest['clientid']
    clientEmail: Email
		items: Evoliz.ValidItemForRequest[]
		term: Evoliz.InvoiceCreateRequest['term']
	}

  /**
   * Main method, and not a regular Evoliz one.
   * - Creates the invoice
   * - Pays it
   * - Sends an email to the client
   */
	const registerInvoice = async ({
		external_document_number,
		clientid,
    clientEmail,
		label,
		items,
		term
	}: InvoiceRegisterRequest) => {
		logger.info('Registering Invoice')
		//await createSaleOrder({ external_document_number, clientid })
		const { invoiceid } = await createInvoice({
			external_document_number,
			clientid,
			documentdate: today(),
			items,
			term
		})
		await payInvoice(invoiceid, { amount: 10, label })
		await saveInvoice(invoiceid)
		logger.info(`Invoice register, sending an email...`)
		await sendInvoiceByEmail(invoiceid, {
			to: [clientEmail],
		})
		logger.log('all done!')
	}

	return {
		fetchEvolizAPI,
		evolizRequest,
		createClient,
		createSaleOrder,
		createInvoice,
		payInvoice,
		saveInvoice,
		registerInvoice,
		getPaymentTerms,
	}
}
