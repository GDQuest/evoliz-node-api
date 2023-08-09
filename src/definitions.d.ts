type Email = `${string}@${string}`
type FullDateAsStr =
	`20${number}-${number}-${number}T${number}:${number}:${number}.000000Z`
type DateAsStr = `20${number}-${number}-${number}`
type UrlString = `https://${string}`

declare namespace Evoliz {
	interface Error400 {
		error: 'Bad Request Error'
		message: Record<string, string[]>
	}

	interface Error401 {
		error: 'Unauthorized'
		message: string
	}

	interface Error403 {
		error: 'Forbidden'
		message: string
	}

	interface Error424 {
		error: 'Failed Dependency'
		message: string
	}

	/** @description Sale order item, if an articleid is given : item will be created from the given article and other given values will overrides the article ones. */
	interface ItemWithArticleId {
		/**
		 * @description Article unique identifier
		 * @example 12345
		 */
		articleid: number
		/**
		 * @description Override article reference with html
		 * @example SPLIT
		 */
		reference?: string
		/**
		 * @description Override article designation with html
		 * @example Banana Split <br />
		 * Pour une durée de 12 mois
		 */
		designation?: string
		/**
		 * Format: float
		 * @description Override article quantity, required when no articleid is given
		 * @example 12.5
		 */
		quantity?: number
		/**
		 * @description Override article quantity unit
		 * @example U
		 */
		unit?: string
		/**
		 * Format: float
		 * @description Override article unit price excluding vat
		 * @example 30.25
		 */
		unit_price_vat_exclude?: number
		/**
		 * Format: float
		 * @description Override article VAT rate
		 * @example 5.5
		 */
		vat_rate?: number
		/** @description Override item rebate */
		rebate?: number | string
		/**
		 * @description Override article sale classification id, only accepted when sale classification are enabled, required if invoice is checked in classifications configuration.
		 * @example 45732
		 */
		sale_classificationid?: number
	}
	/** @description Sale order item, if an articleid is given : item will be created from the given article and other given values will overrides the article ones. */
	interface ItemWithoutArticleId {
		/**
		 * @description Item reference with html
		 * @example SPLIT
		 */
		reference?: string
		/**
		 * @description Item designation with html
		 * @example Banana Split <br />
		 * Pour une durée de 12 mois
		 */
		designation: string
		/**
		 * Format: float
		 * @description Item quantity
		 * @example 12.5
		 */
		quantity: number
		/**
		 * @description Quantity unit
		 * @example U
		 */
		unit?: string
		/**
		 * Format: float
		 * @description Item unit price excluding vat
		 * @example 30.25
		 */
		unit_price_vat_exclude: number
		/**
		 * Format: float
		 * @description Item VAT rate
		 * @example 5.5
		 */
		vat_rate?: number
		/** @description Item rebate */
		rebate?: number | string
		/**
		 * @description Item sale classification id, only accepted when sale classification are enabled, required if invoice is checked in classifications configuration.
		 * @example 45732
		 */
		sale_classificationid?: number
	}

	interface Client {
		/**
		 * @description Object unique identifier
		 * @example 9876
		 */
		clientid: number
		/**
		 * @description Client’s creator ID
		 * @example 3780
		 */
		userid?: number
		/**
		 * @description Client code identifier
		 * @example C00123
		 */
		code?: string
		/**
		 * @description Client civility
		 * @example M.
		 */
		civility?: string
		/**
		 * @description Client name
		 * @example Triiptic
		 */
		name?: string
		/**
		 * @description Client type
		 * @example Professionnel
		 * @enum {string}
		 */
		type?: 'Particulier' | 'Professionnel' | 'Administration publique'
		/**
		 * @description Client's company legal form
		 * @example SAS
		 */
		legalform?: string
		/**
		 * @description Business Number (SIRET)
		 * @example 123 456 789 12345
		 */
		business_number?: string
		/**
		 * @description Main activity code (APE, NAF)
		 * @example 1234A
		 */
		activity_number?: string
		/**
		 * @description Intra-community VAT number<br>'N/C' if Not Concerned, Not Known or Not Communicated
		 * @example FR20123456789
		 */
		vat_number?: string
		/**
		 * @description Client's company registration number (RCS, RM)
		 * @example RCS PARIS 12345678912345
		 */
		immat_number?: string
		bank_information?: BankInformation
		address?: Address
		delivery_address?: Address
		/**
		 * @description Phone number
		 * @example 01 46 72 50 04
		 */
		phone?: string
		/**
		 * @description Cell phone number
		 * @example +33600000000
		 */
		mobile?: string
		/**
		 * @description Fax number
		 * @example 900000000
		 */
		fax?: string
		/**
		 * @description Website
		 * @example https://www.triiptic.fr
		 */
		website?: string
		/**
		 * Format: float
		 * @description Amount of outstanding guarantee
		 * @example 4000
		 */
		safe_amount?: number
		term?:
			| ({
					/**
					 * @description Client's quote period of validity (in days)
					 * @example 0
					 */
					validity?: number
					payterm?: payterm | null
					paytype?: Paytype | null
					/**
					 * @description Client's default vat rate
					 * @example 20
					 */
					var_rate?: number
					/**
					 * @description Client's default rebate in percent
					 * @example 12
					 */
					rebate_percent?: number
					analytic?: Analytic
					/** @description Client's default vat exoneration reason code, refer to [vat exoneration reasons codes](#section/VAT-exoneration-reasons) */
					vat_exoneration?: unknown
					/**
					 * @description Client's default custom vat exoneration reason
					 * @example My custom vat exoneration reason
					 */
					vat_exoneration_other_reason?: string
			  } & Term)
			| null
		/**
		 * @description Billing option (true is incl. taxes, false is excl. taxes and null is Company billing option)
		 * @example false
		 */
		ttc?: boolean | null
		/**
		 * @description Comments on this client
		 * @example Ce client est génial
		 */
		comment?: string
		/** @description Determines if the client is active */
		enabled?: boolean
		custom_fields?: CustomField
	}

	interface CustomField {
		/** @description Hash of the custom field id */
		custom_field_api?: {
			/** @example label1 */
			label?: string
			/** @example value1 */
			value?: string
		}
		/** @description Hash of another custom field id */
		custom_field_api2?: {
			/** @example label2 */
			label?: string
			/** @example value2 */
			value?: string
		}
	}

	/** @description Address informations */
	interface Address {
		/**
		 * @description Address line 1
		 * @example 176 avenue Joseph Louis Lambot
		 */
		addr?: string
		/**
		 * @description Address line 2
		 * @example Etage 2
		 */
		addr2?: string
		/**
		 * @description Postcode
		 * @example 83130
		 */
		postcode?: string
		/**
		 * @description Town
		 * @example La Garde
		 */
		town?: string
		country?: Country
	}
	/** @description Bank informations */
	interface BankInformation {
		/**
		 * @description Bank name
		 * @example Banque Populaire
		 */
		bank_name?: string
		/**
		 * @description Bank account details
		 * @example 12345 6789 012345678901 34
		 */
		bank_account_detail?: string
		/**
		 * @description International Bank Account Number
		 * @example FR00 1234 5678 9012 3456 7890 134
		 */
		iban?: string
		/**
		 * @description Bank Identifier Code (BIC, SWIFT)
		 * @example ABCDEFGH
		 */
		bank_identification_code?: string
	}

	/** @description analytic axis of document */
	interface Analytic {
		/**
		 * @description Analytical axis id
		 * @example 12345
		 */
		id?: number
		/**
		 * @description Analytical axis code identifier
		 * @example ANA3
		 */
		code?: string
		/**
		 * @description Analytical axis label
		 * @example Axe analytique 3
		 */
		label?: string
		/**
		 * @description Determines if analytical axis is active
		 * @example false
		 */
		enabled?: boolean
	}

	/** @description Payment condition type */
	interface Paytype {
		/**
		 * @description Payment type identifier
		 * @example 3
		 */
		paytypeid?: number
		/**
		 * @description Payment type label
		 * @example Carte bancaire
		 */
		label?: string
	}
	/** @description Document condition informations */
	interface Term {
		/**
		 * @description Penalty rate
		 * @example 3
		 */
		penalty?: number
		/**
		 * @description Use legal mention about penalty rate
		 * @example false
		 */
		nopenalty?: boolean
		/**
		 * @description Use legal collection cost
		 * @example false
		 */
		recovery_indemnity?: boolean
		/**
		 * @description Discount rate
		 * @example 0
		 */
		discount_term?: number
		/**
		 * @description No relevant discount rate
		 * @example false
		 */
		no_discount_term?: boolean
		payterm?: payterm
		paytype?: Paytype
	}
	/** @description [Payment condition term](documentation#section/Payment-terms-resource) */
	interface payterm {
		/**
		 * @description Payment term identifier
		 * @example 3
		 */
		paytermid?: PayTermId
		/**
		 * @description Payment term label
		 * @example 15 days
		 */
		label?: string
	}

	/** @description Country informations */
	interface Country {
		/**
		 * @description Country name
		 * @example France
		 */
		label?: string
		/**
		 * @description Country ISO2 code
		 * @example FR
		 */
		iso2?: ISO2
	}

	interface Invoice {
		invoiceid: number
		typedoc: 'invoice'
		document_number: string
		userid: number
		client: {
			clientid: number
			code: string
			civility: string
			name: string
		}
		default_currency: {
			code: 'EUR' | 'USD'
			conversion: number
			symbol: '€' | '$'
		}
		document_currency: null
		total: {
			rebate: {
				amount_vat_exclude: number
				percent: number
			}
			vat_exclude: number
			vat: number
			vat_include: number
			margin: {
				purchase_price_vat_exclude: number
				margin_percent: number
				markup_percent: number
				amount: number
			}
			advance: number
			paid: number
			net_to_pay: number
		}
		currency_total: null
		status_code: number
		status: 'create'
		status_dates: {
			create: FullDateAsStr
			sent: null
			inpayment: null
			paid: null
			match: null
		}
		locked: true
		lockdate: null
		object: string
		documentdate: DateAsStr
		duedate: DateAsStr
		execdate: DateAsStr
		term: {
			penalty: number
			nopenalty: boolean
			recovery_indemnity: boolean
			discount_term: number
			no_discount_term: boolean
			payterm: {
				paytermid: PayTermId
				label: 'number days'
			}
			paytype: {
				paytypeid: number
				label: 'Carte bancaire'
			}
		}
		comment: string
		comment_clean: string
		external_document_number: string
		enabled: true
		analytic: {
			id: number
			code: 'ANA3'
			label: 'Axe analytique 3'
			enabled: boolean
		}
		file: UrlString
		links: UrlString
		webdoc: UrlString
		recovery_number: number
		retention: {
			percent: number
			amount: number
			currency_amount: number
			date: DateAsStr
		}
		items: {
			itemid: number
			articleid: number
			reference: 'SPLIT'
			reference_clean: 'SPLIT'
			designation: 'Banana Split <br />\nPour une durée de 12 mois'
			designation_clean: 'Banana Split\nPour une durée de 12 mois'
			quantity: number
			unit: 'M'
			unit_price_vat_exclude: number
			unit_price_vat_exclude_currency: null
			vat: number
			/** Document total amounts */
			total: {
				rebate: null
				vat_exclude: number
				vat: number
				vat_include: number
				margin: {
					purchase_unit_price_vat_exclude: number
					coefficient: number
					margin_percent: number
					markup_percent: number
					amount: number
				}
			}
			/** Document total amounts in currency */
			currency_total: {
				/** Document amount rebate in currency */
				rebate: {
					amount_vat_exclude: number
					percent: number
				}
				/** Total amount of the document excluding vat in currency */
				vat_exclude: number
				/** Total amount of vat in currency */
				vat: number
				/** Total amount of the document including vat in currency */
				vat_include: number
				margin: {
					purchase_price_vat_exclude: number
					margin_percent: number
					markup_percent: number
					amount: number
				}
			}
			/** Item classification information */
			sale_classification: {
				id: number
				code: number
				label: string
			}
		}
	}

	export interface LoginResponse {
		expires_at: `20${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
		access_token: string
		scopes: ['admin', 'company_users']
	}

	export interface ClientRequest {
		/** @description Client code, if not filled it will be automatically generated */
		code?: string
		/** @description Client name */
		name: string
		/**
		 * @description Client type
		 * @enum {string}
		 */
		type: 'Particulier' | 'Professionnel' | 'Administration publique'
		/** @description Client legal form */
		legalform?: string
		/** @description Client activity number */
		activity_number?: string
		/** @description Client immatriculation number */
		immat_number?: string
		/** @description Client bank informations */
		bank_information?: BankInformation
		/** @description Client address informations */
		address: {
			/** @description Address line 1 */
			addr?: string
			/** @description Address line 2 */
			addr2?: string
			/** @description Postcode */
			postcode: string
			/** @description Town */
			town: string
			/** @description Address ISO2 */
			iso2: ISO2
		}
		/** @description Client delivery address informations */
		delivery_address?: {
			/** @description Delivery Address line 1 */
			addr?: string
			/** @description Delivery Address line 2 */
			addr2?: string
			/** @description Postcode */
			postcode: string
			/** @description Town */
			town: string
			/** @description Delivery Address ISO2 */
			iso2: ISO2
		}
		/** @description Client phone number */
		phone?: string
		/** @description Client mobile number */
		mobile?: string
		/** @description Client fax number */
		fax?: string
		/** @description Client website URL */
		website?: string
		/**
		 * Format: float
		 * @description Amount of outstanding guarantee
		 * @example 4000
		 */
		safe_amount?: number
		/** @description Specific document conditions for the current client */
		term?: {
			/**
			 * @description Use legal collection cost
			 * @example false
			 */
			recovery_indemnity?: boolean
			/** @description Client's quote period of validity (in days) */
			validity?: number
			/**
			 * @description Penalty rate, prohibited if nopenalty is true
			 * @example 3
			 */
			penalty?: number
			/**
			 * @description Use legal mention about penalty rate
			 * @example false
			 */
			nopenalty?: boolean
			/**
			 * @description Discount rate, prohibited if no_discount_term is true
			 * @example 0
			 */
			discount_term?: number
			/**
			 * @description Define the display of the "no discount applicable" legal mention (prohibited if a discount_term is given)
			 * @example false
			 */
			no_discount_term?: boolean
			/**
			 * @description Payment term identifier
			 * @example 3
			 */
			paytermid?: PayTermId
			/**
			 * @description Payment type identifier
			 * @example 3
			 */
			paytypeid?: number
			/**
			 * Format: float
			 * @description Client's default vat rate
			 * @example 2.1
			 */
			vat_rate?: number
			/** @description Client's default vat exoneration reason, only accepted when vat exoneration option is enabled, must be one of [the vat exoneration reasons codes](#section/VAT-exoneration-reasons) */
			vat_exoneration?: unknown
			/**
			 * @description Client's default custom vat exoneration reason, only accepted when the selected `vat_exoneration` is `other`
			 * @example My custom vat exoneration reason
			 */
			vat_exoneration_other_reason?: string
			/**
			 * @description Analytic axis id, this field is accepted only when analytic option is enabled
			 * @example 12345
			 */
			analyticid?: number
			/**
			 * Format: float
			 * @description Client's default rebate in percent, must be between 0 and 100
			 * @example 5.25
			 */
			rebate_percent?: number
		}
		/** @description Billing option (true is incl. taxes, false is excl. taxes and null is Company billing option) */
		ttc?: boolean
		/** @description Comments on this client */
		comment?: string
		/** @description Client business Number (SIRET), if current user is located in FR-DOM-TOM this field can be required. */
		business_number?: string
		/** @description Client intra-community VAT number<br>Set the 'N/C' if Not Concerned, Not Known or Not Communicated, if current user is located in FR-DOM-TOM this field can be required. */
		vat_number?: string
	}

	export interface SaleOrderRequest {
		external_document_number: string
		clientid: number
	}
	export interface SaleOrderResponse {
		orderid: number
		document_number: string
		userid: number
	}

	export interface InvoiceCreateRequest {
		/**
		 * @description External Document number, must be unique
		 * @example EXT001
		 */
		external_document_number: string
		/**
		 * Format: date
		 * @description Document date
		 * @example 2019-10-10
		 */
		documentdate: DateAsStr
		/**
		 * @description The client's id to attach the invoice to
		 * @example 9876
		 */
		clientid: number
		/**
		 * @description The client's contact id to adress the invoice to
		 * @example 8568
		 */
		contactid?: number
		/**
		 * @description object on the document
		 * @example Abonnement Logiciel Gestion Commerciale
		 */
		object?: string
		/** @description Invoice condition informations */
		term: {
			/**
			 * @description Penalty rate, prohibited if nopenalty is true
			 * @example 3
			 */
			penalty?: number
			/**
			 * @description Define the display of legal mention about penalty rate on the created document (prohibited if a penalty is given)
			 * @example false
			 */
			nopenalty?: boolean
			/**
			 * @description Use legal mention about recovery indemnity
			 * @example false
			 */
			recovery_indemnity?: boolean
			/**
			 * @description Discount rate, prohibited if no_discount_term is true
			 * @example 0
			 */
			discount_term?: number
			/**
			 * @description Define the display of the no discount applicable legal mention (prohibited if a discount_term is given)
			 * @example false
			 */
			no_discount_term?: boolean
			/**
			 * @description Payment term identifier
			 * @example 3
			 */
			paytermid: PayTermId
			/**
			 * Format: date
			 * @description Payment due date, required if paytermid is 18 (Saisir une date), must be after or equal to documentdate
			 * @example 2019-10-10
			 */
			duedate?: string
			/**
			 * @description Payment delay in days, required if paytermid is 16 (Autre condition)
			 * @example 20
			 */
			paydelay?: number
			/**
			 * @description Payment is due at the end of the month, required if paytermid is 16 (Autre condition)
			 * @example true
			 */
			endmonth?: boolean
			/**
			 * @description Payment day, required if paytermid is 16 (Autre condition)
			 * @example 25
			 */
			payday?: number
			/**
			 * @description Payment type identifier
			 * @example 3
			 */
			paytypeid?: number
		}
		/**
		 * @description Comments on the invoice with html
		 * @example Titulaire du compte : Hingis160 SARL<br />
		 * Domiciliation du compte : Boulogne<br />
		 * IBAN : FR7612345678901234567890123
		 */
		comment?: string
		/**
		 * @description Analytic axis id, this field is accepted only when analytic option is enabled, required if invoice is checked in analytic configuration.
		 * @example 12345
		 */
		analyticid?: number
		global_rebate?: number | string
		/**
		 * Format: date
		 * @description Execution date of payment terms
		 * @example 2019-09-12
		 */
		execdate?: string
		/** @description Invoice retention information */
		retention?: {
			/**
			 * Format: float
			 * @description Retention percent, this field is accepted only when retention option is enabled, required if retention date is given
			 * @example 5
			 */
			percent?: number
			/**
			 * Format: date
			 * @description Retention date, this field is accepted only when retention option is enabled, required if retention percent is given
			 * @example 2020-12-19
			 */
			date?: string
		}
		/**
		 * @description Indicate whether to include sale general conditions in the document PDF or not
		 * @default false
		 * @example true
		 */
		include_sale_general_conditions?: boolean
		/** @description Invoice items */
		items: ValidItemForRequest[]
	}

	export type ValidItemForRequest = (
		| ItemWithoutArticleId
		| ItemWithArticleId
	) & {
		/**
		 * Format: float
		 * @description Override article purchase unit price, must be less than unit price vat excluded
		 */
		purchase_unit_price_vat_exclude?: number | null
	}

	export interface InvoiceResponse {
		invoiceid: number
		typedoc: 'invoice'
		document_number: string
		userid: number
	}

	export interface InvoicePayRequest {
		label: string
		amount: number
	}

	export type InvoiceSaveResponse =
		| Invoice
		| Error400
		| Error401
		| Error403
		| Error424

	export interface InvoiceSendByEmailRequest {
		/** Array of email recipients address */
		to: Email[]
		/** Send copy to your user email address */
		copy?: boolean
		/** Subject of the email. See dynamic [fields](https://evoliz.io/documentation#section/Invoice-email-dynamic-fields/Body-dynamic-fields-and-their-values) */
		subject?: string
		/** Body of the email in txt or Html. See [dynamic fields](https://evoliz.io/documentation#section/Invoice-email-dynamic-fields/Body-dynamic-fields-and-their-values) */
		body?: string
		/** Send signature of your company in the email */
		signature?: boolean
		/** Add "View PDF" and "Download PDF" links at the end of the email. When parameter is not set, the parameter in Evoliz app email setting is used.*/
		links?: boolean
		contact?: {
			/** Contact client civility, for example, "Mr" */
			civility: string
			/** Contact last name */
			lastname: string
			/** Contact first name */
			firstname: string
		}
	}
}

type ISO2 =
  | "AF"
  | "AX"
  | "AL"
  | "DZ"
  | "AS"
  | "AD"
  | "AO"
  | "AI"
  | "AQ"
  | "AG"
  | "AR"
  | "AM"
  | "AW"
  | "AU"
  | "AT"
  | "AZ"
  | "BS"
  | "BH"
  | "BD"
  | "BB"
  | "BY"
  | "BE"
  | "BZ"
  | "BJ"
  | "BM"
  | "BT"
  | "BO"
  | "BQ"
  | "BA"
  | "BW"
  | "BV"
  | "BR"
  | "IO"
  | "BN"
  | "BG"
  | "BF"
  | "BI"
  | "KH"
  | "CM"
  | "CA"
  | "CV"
  | "KY"
  | "CF"
  | "TD"
  | "CL"
  | "CN"
  | "CX"
  | "CC"
  | "CO"
  | "KM"
  | "CG"
  | "CD"
  | "CK"
  | "CR"
  | "CI"
  | "HR"
  | "CU"
  | "CW"
  | "CY"
  | "CZ"
  | "DK"
  | "DJ"
  | "DM"
  | "DO"
  | "EC"
  | "EG"
  | "SV"
  | "GQ"
  | "ER"
  | "EE"
  | "ET"
  | "FK"
  | "FO"
  | "FJ"
  | "FI"
  | "FR"
  | "GF"
  | "PF"
  | "TF"
  | "GA"
  | "GM"
  | "GE"
  | "DE"
  | "GH"
  | "GI"
  | "GR"
  | "GL"
  | "GD"
  | "GP"
  | "GU"
  | "GT"
  | "GG"
  | "GN"
  | "GW"
  | "GY"
  | "HT"
  | "HM"
  | "VA"
  | "HN"
  | "HK"
  | "HU"
  | "IS"
  | "IN"
  | "ID"
  | "IR"
  | "IQ"
  | "IE"
  | "IM"
  | "IL"
  | "IT"
  | "JM"
  | "JP"
  | "JE"
  | "JO"
  | "KZ"
  | "KE"
  | "KI"
  | "KR"
  | "KP"
  | "KW"
  | "KG"
  | "LA"
  | "LV"
  | "LB"
  | "LS"
  | "LR"
  | "LY"
  | "LI"
  | "LT"
  | "LU"
  | "MO"
  | "MK"
  | "MG"
  | "MW"
  | "MY"
  | "MV"
  | "ML"
  | "MT"
  | "MH"
  | "MQ"
  | "MR"
  | "MU"
  | "YT"
  | "MX"
  | "FM"
  | "MD"
  | "MC"
  | "MN"
  | "ME"
  | "MS"
  | "MA"
  | "MZ"
  | "MM"
  | "NA"
  | "NR"
  | "NP"
  | "NL"
  | "NC"
  | "NZ"
  | "NI"
  | "NE"
  | "NG"
  | "NU"
  | "NF"
  | "MP"
  | "NO"
  | "OM"
  | "PK"
  | "PW"
  | "PS"
  | "PA"
  | "PG"
  | "PY"
  | "PE"
  | "PH"
  | "PN"
  | "PL"
  | "PT"
  | "PR"
  | "QA"
  | "RE"
  | "RO"
  | "RU"
  | "RW"
  | "BL"
  | "SH"
  | "KN"
  | "LC"
  | "MF"
  | "PM"
  | "VC"
  | "WS"
  | "SM"
  | "ST"
  | "SA"
  | "SN"
  | "RS"
  | "SC"
  | "SL"
  | "SG"
  | "SX"
  | "SK"
  | "SI"
  | "SB"
  | "SO"
  | "ZA"
  | "GS"
  | "SS"
  | "ES"
  | "LK"
  | "SD"
  | "SR"
  | "SJ"
  | "SZ"
  | "SE"
  | "CH"
  | "SY"
  | "TW"
  | "TJ"
  | "TZ"
  | "TH"
  | "TL"
  | "TG"
  | "TK"
  | "TO"
  | "TT"
  | "TN"
  | "TR"
  | "TM"
  | "TC"
  | "TV"
  | "UG"
  | "UA"
  | "AE"
  | "GB"
  | "US"
  | "UM"
  | "UY"
  | "UZ"
  | "VU"
  | "VE"
  | "VN"
  | "VG"
  | "VI"
  | "WF"
  | "EH"
  | "YE"
  | "ZM"
  | "ZW"


type PayTermId = 
	/** When received */
	| 1
	/** When ordered */
	| 17 
	/** End of month */
	| 2 
	/** 15 days*/
	| 3
	/** 20 days*/
	| 4 
	/** 30 days*/
	| 5 
	/** 45 days*/
	| 6 
	/** 60 days*/
	| 7 
	/** 90 days*/
	| 8 
	/** 30 days end of month */
	| 9 
	/** 45 days end of month */
	| 10 
	/** 60 days end of month */
	| 11 
	/** 90 days end of month */
	| 12 
	/** 30 days end of month on the 10th */
	| 13 
	/** 45 days end of month on the 1st */
	| 14 