const { GET_LOCATIONS_QUERY } = require("./graphql/queries");
const client = require("./graphql/client");

const getLocations = async () => {
	try {
		const response = await client.query({
			query: GET_LOCATIONS_QUERY,
		});

		const locations = response.data.locations.edges.map((edge) => edge.node);

		return { success: true, locations };
	} catch (error) {
		console.error("Error fetching locations:", error);
		return { success: false, error };
	}
};

const main = async () => {
	const result = await getLocations();

	if (result.success) {
		console.log("Locations:", result.locations);
	} else {
		console.error("Failed to fetch locations:", result.error);
	}
};

main();
// ----------------------------------

/* const { ApolloClient, InMemoryCache, gql } = require("@apollo/client/core");
const fetch = require("cross-fetch");

const client = require("./graphql/client");

const GET_PRODUCT_INVENTORY_QUERY = gql`
	query GetProductInventory($productId: ID!) {
		product(id: $productId) {
			variants(first: 1) {
				edges {
					node {
						id
						inventoryItem {
							id
						}
					}
				}
			}
			locations(first: 1) {
				edges {
					node {
						id
						name
					}
				}
			}
		}
	}
`;

const getProductInventoryDetails = async (productId) => {
	try {
		const response = await client.query({
			query: GET_PRODUCT_INVENTORY_QUERY,
			variables: { productId },
		});

		const product = response.data.product;
		const variant = product.variants.edges[0].node;
		const location = product.locations.edges[0].node;

		return {
			variantId: variant.id,
			inventoryItemId: variant.inventoryItem.id,
			locationId: location.id,
		};
	} catch (error) {
		console.error("Error fetching product inventory details:", error);
		return { success: false, error };
	}
};

// Example usage
const main = async () => {
	const productId = "gid://shopify/Product/9063649968461"; // Replace with your actual product ID
	const details = await getProductInventoryDetails(productId);
	console.log(details);
};

main(); */

/* const { getPublications } = require("./graphql/operations");

const fetchAndDisplayPublications = async () => {
	const publications = await getPublications();
	console.log("Publications:", publications);
};

fetchAndDisplayPublications();
 */
