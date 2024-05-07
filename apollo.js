const { ApolloClient, InMemoryCache, createHttpLink, gql } = require("@apollo/client/core");
const fetch = require("cross-fetch");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

dotenv.config();

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

const encodeGlobalId = (id) => Buffer.from(`gid://shopify/Product/${id}`).toString("base64");
const encodeVariantId = (variantId) =>
	Buffer.from(`gid://shopify/ProductVariant/${variantId}`).toString("base64");

const extractNumericId = (idString) => {
	return idString.split("/").pop();
};

// ------------------------------------------------------------ CREATE PRODUCT ------------------------------------------------------------

const CREATE_PRODUCT_MUTATION = gql`
	mutation CreateProduct($input: ProductInput!) {
		productCreate(input: $input) {
			product {
				id
				title
				descriptionHtml
				productType
				vendor
				tags
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const createProduct = async (productDetails) => {
	try {
		const productResponse = await client.mutate({
			mutation: CREATE_PRODUCT_MUTATION,
			variables: { input: productDetails },
		});
		//console.log("Product creation successful:", productResponse.data.productCreate);
		return productResponse.data.productCreate;
	} catch (error) {
		console.error("Error creating product:", error);
	}
};

// ------------------------------------------------------------ UPDATE PRODUCT ------------------------------------------------------------
const UPDATE_PRODUCT_MUTATION = gql`
	mutation UpdateProduct($input: ProductInput!) {
		productUpdate(input: $input) {
			product {
				id
				title
				descriptionHtml
				productType
				vendor
				tags
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const UPDATE_VARIANT_MUTATION = gql`
	mutation UpdateVariant($input: ProductVariantInput!) {
		productVariantUpdate(input: $input) {
			productVariant {
				id
				price
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const updateProductAndVariants = async (productId, productUpdates, variantUpdates) => {
	try {
		const productResponse = await client.mutate({
			mutation: UPDATE_PRODUCT_MUTATION,
			variables: { input: { id: encodeGlobalId(productId), ...productUpdates } },
		});
		//console.log("Product update successful:", productResponse.data.productUpdate);
	} catch (error) {
		console.error("Error updating product:", error);
	}

	// Update each variant individually
	for (const variant of variantUpdates) {
		const encodedVariantId = encodeVariantId(variant.id);

		try {
			const variantResponse = await client.mutate({
				mutation: UPDATE_VARIANT_MUTATION,
				variables: { input: { id: encodedVariantId, price: variant.price } }, // Only include fields that are part of ProductVariantInput
			});
			//console.log("Variant update successful:", variantResponse.data.productVariantUpdate);
		} catch (error) {
			console.error("Error updating variant:", error);
		}
	}
};

// ------------------------------------------------------------ UPLOAD PICTURE ------------------------------------------------------------
const STAGED_UPLOADS_CREATE = gql`
	mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
		stagedUploadsCreate(input: $input) {
			stagedTargets {
				url
				resourceUrl
				parameters {
					name
					value
				}
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const createStagedUploads = async (file) => {
	// Prepare the input according to the Shopify GraphQL API requirements
	const input = {
		filename: file.name,
		mimeType: file.type,
		resource: "IMAGE", // Specify the resource type. Adjust as necessary for other types like VIDEO or MODEL_3D.
		fileSize: file.size.toString(), // Convert fileSize to string
		httpMethod: "PUT", // Choose either PUT or POST based on your requirements
	};

	try {
		const response = await client.mutate({
			mutation: STAGED_UPLOADS_CREATE,
			variables: {
				input: [input], // Ensure the input is an array of StagedUploadInput as required
			},
		});

		if (response.errors) {
			console.error("GraphQL Errors:", response.errors);
			return null;
		}

		console.log("Staged Uploads Created:", response.data.stagedUploadsCreate.stagedTargets);
		return response.data.stagedUploadsCreate.stagedTargets;
	} catch (error) {
		console.error("Error creating staged uploads:", error);
		return null;
	}
};

const uploadFileToStagedURL = async (stagedTarget, file) => {
	// Reading in the file
	const fileStream = fs.createReadStream(file.path);

	const formData = new FormData();
	stagedTarget.parameters.forEach((param) => {
		formData.append(param.name, param.value);
	});

	const url = stagedTarget.url;

	const headers = {
		content_type: "image/jpeg",
		acl: "private",
	};

	const response = await fetch(url, {
		method: "PUT",
		body: fileStream,
		headers: headers,
	});

	//console.log(response.url, "RES");
	return response.url;
};

const addMediaToProduct = async (productId, media) => {
	try {
		const response = await client.mutate({
			mutation: gql`
				mutation CreateProductMedia($productId: ID!, $media: [CreateMediaInput!]!) {
					productCreateMedia(productId: $productId, media: $media) {
						media {
							alt
							mediaContentType
							status
							id
							mediaErrors {
								code
								details
								message
							}
							mediaWarnings {
								code
								message
							}
						}
						product {
							id
						}
						mediaUserErrors {
							code
							field
							message
						}
					}
				}
			`,
			variables: {
				productId: productId,
				media: media,
			},
		});
		//console.log("Media added to product:", response.data.productCreateMedia);
		return response.data.productCreateMedia;
	} catch (error) {
		console.error("Error adding media to product:", error);
		throw error;
	}
};

const addPictureToProduct = async (productId, filePath) => {
	const file = {
		path: filePath,
		name: path.basename(filePath),
		type: "image/jpeg", // Adjust as necessary based on the file type
		size: fs.statSync(filePath).size,
	};
	try {
		const stagedTargets = await createStagedUploads(file);
		//console.log(stagedTargets, "stagedTargets");
		const resourceUrl = await uploadFileToStagedURL(stagedTargets[0], file);
		//console.log(resourceUrl, "resourceUrl");

		// Add media to the product using the staged URL
		//const productId = `gid://shopify/Product/${productId}`; // Replace with actual product ID
		const mediaInput = [
			{
				originalSource: resourceUrl,
				alt: "Image description",
				mediaContentType: "IMAGE",
			},
		];
		await addMediaToProduct(encodeGlobalId(productId), mediaInput);
		console.log(productId);
		printLabel(productId);
	} catch (error) {
		console.error("Error during file upload process:", error);
	}
};

// -------------------------------------------------------- GET PRODUCT --------------------------------------------------------

const GET_PRODUCT_QUERY = gql`
	query getProduct($id: ID!) {
		product(id: $id) {
			id
			title
			descriptionHtml
			productType
			vendor
			createdAt
			variants(first: 5) {
				edges {
					node {
						id
						title
						price
						sku
					}
				}
			}
			images(first: 3) {
				edges {
					node {
						src
						altText
					}
				}
			}
		}
	}
`;

const getProduct = async (productId) => {
	try {
		const response = await client.query({
			query: GET_PRODUCT_QUERY,
			variables: { id: encodeGlobalId(productId) },
			fetchPolicy: "network-only", // Ensures it does not use the cache for the initial fetch
		});

		if (response.data && response.data.product) {
			console.log(
				"Product fetched successfully:",
				JSON.stringify(response.data.product, null, 2)
			);
		} else {
			console.error("Failed to fetch product:", response.errors);
		}
	} catch (error) {
		console.error("Error fetching product:", error);
	}
};

const printLabel = async (productId) => {
	// Define the path to your virtual environment activation script
	const virtualEnvActivateScript =
		"source /Users/mathiaslorenceau/Code/label_printer/myenv/bin/activate"; // Replace '/path/to/your/virtualenv/' with the actual path

	// Define the Python script command
	const pythonScript = "python /Users/mathiaslorenceau/Code/label_printer/print_label.py"; // Replace '/path/to/your/python_script.py' with the actual path

	console.log(productId, "id passed to python");

	// Execute the activation script followed by the Python script with the ID as an argument
	exec(`${virtualEnvActivateScript} && ${pythonScript} ${productId}`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`stderr: ${stderr}`);
			return;
		}
		console.log(`Output: ${stdout}`);
	});
};

// ------------------------------------------------------------ RUN ------------------------------------------------------------

/* (async () => {
	const resCreateProduct = await createProduct({
		title: "Marlboro Jacket",
		descriptionHtml: "<p>Dark brown Jacket</p>",
		vendor: "New Brand",
	});

	const prodId = extractNumericId(resCreateProduct.product.id);
	console.log(prodId, "prodId");

	const updateRes = await updateProductAndVariants(
		prodId,
		{
			title: "Marlboro Jacket",
			descriptionHtml: "<p>Marlboro Jacket</p>",
			productType: "Apparel",
			vendor: "Brand Name",
			tags: ["Summer", "Outdoor", "Sale"],
		},
		[
			{
				id: "48024634458458",
				price: "19933",
			},
		]
	);
	console.log(updateRes, "updateRes");

	const addPicRes = addPictureToProduct(
		prodId,
		"/Users/mathiaslorenceau/Documents/entrepreneurial_projects/vintage_collective/foto_station/images.jpg"
	);
	console.log(addPicRes, "addPicRes");
})(); */

/* updateProductAndVariants(
	resCreateProduct,
	{
		title: "Marlboro Jacket",
		descriptionHtml: "<p>Marlboro Jacket</p>",
		productType: "Apparel",
		vendor: "Brand Name",
		tags: ["Summer", "Outdoor", "Sale"],
	},
	[
		{
			id: "48024634458458",
			price: "19933",
		},
	]
); */

/* addPictureToProduct(
	8874937155930,
	"/Users/mathiaslorenceau/Documents/entrepreneurial_projects/vintage_collective/foto_station/images.jpg"
); */
/* // Example usage of the function
updateProductAndVariants(
	"8874937155930",
	{
		title: "SARAAAAAAAHHHHH",
		descriptionHtml: "<p>Updated description here</p>",
		productType: "Apparel",
		vendor: "Brand Name",
		tags: ["Summer", "Outdoor", "Sale"],
	},
	[
		{
			id: "48024634458458",
			price: "19933",
		},
	]
); */

/* const file = {
	path: "/Users/mathiaslorenceau/Desktop/smaller.jpg",
	name: "smaller.jpg",
	type: "image/jpeg",
	size: fs.statSync("/Users/mathiaslorenceau/Desktop/smaller.jpg").size,
}; */

//uploadProductImage("8874937155930", "/Users/mathiaslorenceau/Desktop/smaller.jpg");

//getProduct("8874937155930");

/* 
createProduct({
	title: "16_4 product 12:12",
	descriptionHtml: "<p>New product description here</p>",
	productType: "Apparel",
	vendor: "New Brand",
	tags: ["New", "Innovative", "Exclusive"],
}); */

// ----------------------------------
//console.log(stagedTargets[0].parameters, "parameters");

module.exports = {
	encodeGlobalId,
	encodeVariantId,
	extractNumericId,

	createProduct,
	updateProductAndVariants,
	createStagedUploads,
	addPictureToProduct,
	getProduct,
	// Add other functions similarly
};
