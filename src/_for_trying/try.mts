#!/usr/bin/env node
/**
 * File used to test Evoliz
 * Feel free to modify, this never makes it in the published library
 */
import 'dotenv/config'
import { join } from 'path'
import createTest from './try_tools.mjs'
import { strict as assert } from 'node:assert';
const public_key = process.env.EVOLIZ_PUBLIC_KEY
const secret_key = process.env.EVOLIZ_SECRET_KEY

assert.ok(public_key, `EVOLIZ_PUBLIC_KEY is not set`)
assert.ok(secret_key, `EVOLIZ_SECRET_KEY is not set`)

const dbFilePath = join(process.cwd(), 'db.json')

const {test, getPaymentTerms } = createTest({public_key, secret_key, logger: console, dbFilePath })

//const log = (t) => console.log(t)
//getPaymentTerms().then(log).catch(log)

test()