const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { ApolloClient, InMemoryCache, createHttpLink } = require("@apollo/client/core");
const fetch = require("cross-fetch");

// ------------------------ Each Client ------------------------

const etageClient = new ApolloClient({
	link: createHttpLink({
		uri: `${process.env.SHOPIFY_STORE_URL_ETAGE}/admin/api/2024-04/graphql.json`,
		headers: {
			"Content-Type": "application/json",
			"X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN_ETAGE,
		},
		fetch,
	}),
	cache: new InMemoryCache(),
});

const michelleTamarClient = new ApolloClient({
	link: createHttpLink({
		uri: `${process.env.SHOPIFY_STORE_URL_MICHELLE_TAMAR}/admin/api/2024-04/graphql.json`,
		headers: {
			"Content-Type": "application/json",
			"X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN_MICHELLE_TAMAR,
		},
		fetch,
	}),
	cache: new InMemoryCache(),
});

// ------------------------ Empty Initial Client ------------------------

/* let currentClient;

// ------------------------ Get & Set ------------------------

const getCurrentClient = () => {
	return currentClient;
};

const setCurrentClient = (storeName) => {
	switch (storeName) {
		case "etage":
			currentClient = etageClient;
			break;
		case "michelletamar":
			currentClient = michelleTamarClient;
			break;
		default:
			throw new Error(`Unknown store: ${storeName}`);
	}
}; */

module.exports = {
	etageClient,
	michelleTamarClient,
};

// -------------- initial version --------------

/* 
const client = new ApolloClient({
	link: createHttpLink({
		uri: `${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`,
		headers: {
			"Content-Type": "application/json",
			"X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
		},
		fetch,
	}),
	cache: new InMemoryCache(),
}); */

// -------------- just switch version --------------

/* const createShopifyClient = (storeName) => {
	let uri, accessToken;

	switch (storeName) {
		case "etage":
			uri = `${process.env.ETAGE_SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`;
			accessToken = process.env.ETAGE_SHOPIFY_ACCESS_TOKEN;
			break;
		case "michelletamar":
			uri = `${process.env.MICHELLETAMAR_SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`;
			accessToken = process.env.MICHELLETAMAR_SHOPIFY_ACCESS_TOKEN;
			break;
		default:
			throw new Error(`Unknown store: ${storeName}`);
	}

	return new ApolloClient({
		link: createHttpLink({
			uri: uri,
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": accessToken,
			},
			fetch,
		}),
		cache: new InMemoryCache(),
	});
}; */
