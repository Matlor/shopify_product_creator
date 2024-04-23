import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* const encodeGlobalId = (id) => {
	return Buffer.from(`gid://shopify/Product/${id}`).toString("base64");
}; */

const encodeGlobalId = (id) => Buffer.from(`gid://shopify/${id}`).toString("base64");
const encodeVariantId = (variantId) =>
	Buffer.from(`gid://shopify/ProductVariant/${variantId}`).toString("base64");

const shopifyGraphqlApiCall = async (query, variables = {}) => {
	const url = `${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`;

	try {
		const response = await axios({
			url: url,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
			},
			data: {
				query: query,
				variables: variables,
			},
		});
		console.log(`Operation successful:`, response.data);
		return response.data;
	} catch (error) {
		console.error(
			`Error during API call:`,
			error.response ? error.response.data : error.message
		);
		return null;
	}
};
const createProduct = async () => {
	const query = `
        mutation productCreate($input: ProductInput!) {
            productCreate(input: $input) {
                product {
                    id
                    title
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

	const variables = {
		input: {
			title: "Simple Product",
			bodyHtml: "This is a simple product without variants.",
		},
	};

	await shopifyGraphqlApiCall(query, variables);
};

const updateProduct = async (productId, newTitle) => {
	const query = `
        mutation productUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
                product {
                    id
                    title
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

	const variables = {
		input: {
			id: encodeGlobalId(productId),
			title: newTitle,
		},
		variants: [
			{
				title: "Variant Title",
				price: "19.99",
				sku: "SKU12345",
				position: 1,
				inventory_policy: "deny",
				compare_at_price: "29.99",
				fulfillment_service: "manual",
				inventory_management: "shopify",
				option1: "First Option Value",
				option2: "Second Option Value",
				option3: "Third Option Value",
				created_at: "ISO 8601 date format",
				updated_at: "ISO 8601 date format",
				taxable: true,
				barcode: "123456789012",
				grams: 200,
				image_id: 850703190,
				inventory_quantity: 15,
				weight: 0.2,
				weight_unit: "kg",
				old_inventory_quantity: 15,
				requires_shipping: true,
			},
		],
	};

	await shopifyGraphqlApiCall(query, variables);
};

/* const uploadProductImage = async (productId, imageData) => {
	const query = `
      mutation productImageCreate($productId: ID!, $image: ImageInput!) {
        productImageCreate(productId: $productId, image: $image) {
          image {
            id
            src
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

	const variables = {
		productId: productId,
		image: {
			attachment: imageData, // Base64 encoded string of the image
		},
	};

	await shopifyGraphqlApiCall(query, variables);
}; */

// Creating a product
//createProduct();

// Updating a product | Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0Lzg4NzQzNzI3NTk4OTg=
updateProduct("8874372759898", "Updated Title 3");

// Uploading an image to a product
//uploadImageToShopify("8873957556570", "/path/to/image.jpg");
