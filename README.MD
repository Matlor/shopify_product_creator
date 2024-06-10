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
