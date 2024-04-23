require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const path = require("path");

const shopifyApiCall = async (method, url, data) => {
	try {
		const response = await axios({
			method: method,
			url: url,
			data: data,
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
			},
		});
		console.log(`Operation successful:`, response.data.product.variants);
		return response.data;
	} catch (error) {
		console.error(
			`Error during API call:`,
			error.response ? error.response.data : error.message
		);
		return null; // Return null to indicate failure
	}
};

const createProduct = async () => {
	const url = `${process.env.SHOPIFY_STORE_URL}/admin/api/2022-01/products.json`;
	const data = {
		product: {
			title: "New func",
			body_html: "body_html",
			variants: [{ price: "987.00" }],
		},
	};
	console.log(await shopifyApiCall("post", url, data), "create");
};

const updateProduct = async (productId, newTitle, newPrice) => {
	const url = `${process.env.SHOPIFY_STORE_URL}/admin/api/2022-01/products/${productId}.json`;
	const data = {
		product: {
			id: productId,
			title: newTitle,
			variants: [{ price: newPrice }],
		},
	};
	await shopifyApiCall("put", url, data);
};

const uploadImageToShopify = async (productId, imagePath) => {
	try {
		/* const imageData = fs.readFileSync(imagePath, { encoding: "base64" });
		const fileExtension = path.extname(imagePath).slice(1);
		const mimeType = `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`;
		const imageBase64 = `data:${mimeType};base64,${imageData}`; */

		const url = `${process.env.SHOPIFY_STORE_URL}/admin/api/2023-01/products/${productId}/images.json`;
		const data = {
			image: {
				attachment: r64,
				filename: path.basename(imagePath),
			},
		};

		const result = await shopifyApiCall("post", url, data);
		if (!result) {
			console.error("Failed to upload image due to the above error");
		} else {
			console.log("Image uploaded successfully:", result);
		}
	} catch (error) {
		console.error("Failed to read or process image file:", error);
	}
};

createProduct();
//updateProduct(8873915318618, "we did change this product at 11:05", 300);

(async () => {
	//uploadImageToShopify(8873915318618, "/Users/mathiaslorenceau/Desktop/IMG_3708.JPG");
})();

/* 
{
    "product": {
        "title": "Unique Product Title",
        "body_html": "<strong>Detailed product description goes here.</strong>",
        "vendor": "Vendor Name",
        "product_type": "Product Category",
        "created_at": "ISO 8601 date format",
        "handle": "custom-handle",
        "updated_at": "ISO 8601 date format",
        "published_at": "ISO 8601 date format",
        "template_suffix": "custom-product-template",
        "status": "active",
        "published_scope": "web",
        "tags": "tag1, tag2, tag3",
        "admin_graphql_api_id": "gid://shopify/Product/1234567890",
        "variants": [
            {
                "title": "Variant Title",
                "price": "19.99",
                "sku": "SKU12345",
                "position": 1,
                "inventory_policy": "deny",
                "compare_at_price": "29.99",
                "fulfillment_service": "manual",
                "inventory_management": "shopify",
                "option1": "First Option Value",
                "option2": "Second Option Value",
                "option3": "Third Option Value",
                "created_at": "ISO 8601 date format",
                "updated_at": "ISO 8601 date format",
                "taxable": true,
                "barcode": "123456789012",
                "grams": 200,
                "image_id": 850703190,
                "inventory_quantity": 15,
                "weight": 0.2,
                "weight_unit": "kg",
                "old_inventory_quantity": 15,
                "requires_shipping": true
            }
        ],
        "options": [
            {
                "name": "Size",
                "position": 1,
                "values": ["Small", "Medium", "Large"]
            },
            {
                "name": "Color",
                "position": 2,
                "values": ["Red", "Blue", "Green"]
            }
        ],
        "images": [
            {
                "src": "https://example.com/path/to/image.jpg",
                "alt": "Image description",
                "position": 1,
                "id": 456789,
                "created_at": "ISO 8601 date format",
                "updated_at": "ISO 8601 date format",
                "width": 123,
                "height": 456
            }
        ],
        "image": {
            "src": "https://example.com/path/to/main-image.jpg"
        },
        "metafields": [
            {
                "namespace": "global",
                "key": "new_key",
                "value": "Value of the metafield",
                "value_type": "string"
            }
        ]
    }
}
*/

/////////////////////////////

/* console.log(Shopify);

const client = new Shopify.GraphqlClient();
console.log(client); */

/* Shopify.Context.initialize({
	API_KEY: process.env.SHOPIFY_API_KEY,
	API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
	SCOPES: process.env.SCOPES.split(","),
	HOST_NAME: process.env.HOST_NAME,
	API_VERSION: Shopify.Context.LATEST_API_VERSION,
	IS_EMBEDDED_APP: false,
	SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const client = new Shopify.Clients.Graphql(shop, accessToken); */

//const t = `${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`;

//import Shopify from "@shopify/shopify-api";
