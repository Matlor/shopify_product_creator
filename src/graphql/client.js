const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { ApolloClient, InMemoryCache, createHttpLink } = require("@apollo/client/core");
const fetch = require("cross-fetch");

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
});

module.exports = client;
