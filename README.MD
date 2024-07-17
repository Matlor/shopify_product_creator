How to run:

run backend that creates shopify entries based on watched folder:
node watchFolder.js

run frontend:
npm run electron

Run with hot reload:
open the project "runner" and run it. It watches the UI or src folder for changes

---

Here I can see all the mutations that are possible apparently
https://shopify.dev/docs/api/admin-graphql/2024-01/objects/Product#mutations

The launch file on my desktop contains this:

#!/bin/bash
cd /Users/mathiaslorenceau/Code/shopify_product_creator/
node watchFolder.js

So we ran the old code with simply this "node watchFolder.js"

Now we can do: node src/index.js

Id of the Sales Channels
Publications: [
{
id: 'gid://shopify/Publication/203647844685',
name: 'Online Store'
},
{
id: 'gid://shopify/Publication/203647910221',
name: 'Point of Sale'
},
{ id: 'gid://shopify/Publication/203647942989', name: 'Shop' }
]

-> got it by running this:
const { getPublications } = require("./graphql/operations");

const fetchAndDisplayPublications = async () => {
const publications = await getPublications();
console.log("Publications:", publications);
};

fetchAndDisplayPublications();

In graphql apparently is what is returned dependent on how the mutation looks like
const UPDATE_VARIANT_MUTATION = gql`	mutation UpdateVariant($input: ProductVariantInput!) {
		productVariantUpdate(input: $input) {
			productVariant {
				id
				price
				barcode
				inventoryPolicy
				inventoryQuantity
				availableForSale
				createdAt
				updatedAt
			}
			userErrors {
				field
				message
			}
		}
	}`;
-> this will return stuff like that "inventoryPolicy" but I still only change the barcode and price -> nice!

Locations: [
{
__typename: 'Location',
id: 'gid://shopify/Location/92197388621',
name: 'Agnesstrasse 22'
}
]

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

Reading the docs:

-   ich kann beim product sehen das es ein inventoryItem gibt. Dann klicke ich darauf und sehe quasi das objekt. und dann dort steht
    mutations irgendwo. diese kann ich dann nutzen um es zu ändern.
