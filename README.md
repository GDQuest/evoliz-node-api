# EVOLIZ Node API

The part of the API that's implemented is specifically for the needs of GDQuest, it's not a complete implementation.

All we're looking to do, is created paid invoices on Evoliz; we do not need the rest of their services, as we handle the payments ourselves.

Therefore, there's only one important function to take from the API:

## How to Run for Development/Testing

The recommended way to test the API is to:

### Get your public and private keys on Evoliz

1. Create a test user on [Evoliz](https://evoliz.com)
2. Click on "My profile", scroll to "developer" at the bottom of the page, and click the [link](https://www.evoliz.com/test40/apps/a/connector/apps_evolizapi)
3. Create a key

### Prepare your local environment

1. `npm install`
2. Copy the file `.env.template` as a `.env`
3. Write your Evoliz values in it
4. Run `node run try`
5. open [`src/_for_trying/try.mts`](./src/_for_trying/try.mts) to write code that you want to test.
