const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("cross-fetch");
const { v4: uuidv4 } = require("uuid");
const client = require("./client");
const {
	CREATE_PRODUCT_MUTATION,
	PUBLISHABLE_PUBLISH_MUTATION,
	UPDATE_PRODUCT_MUTATION,
	INVENTORY_ADJUST_QUANTITIES_MUTATION,
	INVENTORY_ITEM_UPDATE_MUTATION,
	UPDATE_VARIANT_MUTATION,
	STAGED_UPLOADS_CREATE,
	CREATE_PRODUCT_MEDIA,
} = require("./mutations");
const { GET_PRODUCT_QUERY, GET_PUBLICATIONS_QUERY } = require("./queries");
const { encodeGlobalId, encodeVariantId, extractNumericId } = require("./helpers");

const uploadFileToStagedURL = async (stagedTarget, file) => {
	const fileStream = fs.createReadStream(file.path);
	const formData = new FormData();

	stagedTarget.parameters.forEach((param) => {
		formData.append(param.name, param.value);
	});

	const url = stagedTarget.url;

	const headers = {
		"content-type": "image/jpeg",
		acl: "private",
	};

	try {
		const response = await fetch(url, {
			method: "PUT",
			body: fileStream,
			headers: headers,
		});
		return { success: true, url: response.url };
	} catch (error) {
		console.error("Error uploading file to staged URL:", error);
		return { success: false, error };
	}
};

const createProduct = async (productDetails) => {
	try {
		const productResponse = await client.mutate({
			mutation: CREATE_PRODUCT_MUTATION,
			variables: { input: productDetails },
		});

		if (productResponse.data.productCreate.userErrors.length) {
			return { success: false, error: productResponse.data.productCreate.userErrors };
		}

		return { success: true, product: productResponse.data.productCreate.product };
	} catch (error) {
		console.error("Error creating product:", error);
		return { success: false, error };
	}
};

const publishProduct = async (productId, publicationIds) => {
	console.log(productId, "inside publish, id");
	try {
		const input = publicationIds.map((publicationId) => ({ publicationId }));
		const publishResponse = await client.mutate({
			mutation: PUBLISHABLE_PUBLISH_MUTATION,
			variables: { id: encodeGlobalId(productId), input },
		});
		console.log(publishResponse, "publishResponse");
		return { success: true, publication: publishResponse.data.publishablePublish };
	} catch (error) {
		console.error("Error publishing product:", error);
		return { success: false, error };
	}
};

const updateProduct = async (productId, productUpdates) => {
	try {
		const response = await client.mutate({
			mutation: UPDATE_PRODUCT_MUTATION,
			variables: { input: { id: encodeGlobalId(productId), ...productUpdates } },
		});

		if (response.data.productUpdate.userErrors.length) {
			return { success: false, error: response.data.productUpdate.userErrors };
		}

		return { success: true, product: response.data.productUpdate.product };
	} catch (error) {
		console.error("Error updating product:", error);
		return { success: false, error };
	}
};

const updateVariant = async (variantId, variantUpdates) => {
	try {
		const response = await client.mutate({
			mutation: UPDATE_VARIANT_MUTATION,
			variables: { input: { id: encodeVariantId(variantId), ...variantUpdates } },
		});

		if (response.data.productVariantUpdate.userErrors.length) {
			return { success: false, error: response.data.productVariantUpdate.userErrors };
		}

		return { success: true, variant: response.data.productVariantUpdate.productVariant };
	} catch (error) {
		console.error("Error updating variant:", error);
		return { success: false, error };
	}
};

const updateInventoryItem = async (inventoryItemId) => {
	try {
		console.log({ id: inventoryItemId, input: { tracked: true } }, "||||||||||||||||||");
		const response = await client.mutate({
			mutation: INVENTORY_ITEM_UPDATE_MUTATION,
			variables: { id: inventoryItemId, input: { tracked: true } },
		});

		if (response.data.inventoryItemUpdate.userErrors.length) {
			return { success: false, error: response.data.inventoryItemUpdate.userErrors };
		}

		return { success: true, inventoryItem: response.data.inventoryItemUpdate.inventoryItem };
	} catch (error) {
		console.error("Error updating inventory item:", error);
		return { success: false, error };
	}
};

const adjustInventory = async (inventoryItemId, locationId, availableDelta) => {
	try {
		const response = await client.mutate({
			mutation: INVENTORY_ADJUST_QUANTITIES_MUTATION,
			variables: {
				input: {
					reason: "correction", // Example reason
					name: "available", // Inventory quantity name
					referenceDocumentUri: "logistics://some.warehouse/take/2023-01/13", // Example reference document URI
					changes: [
						{
							delta: availableDelta,
							inventoryItemId,
							locationId,
						},
					],
				},
			},
		});
		console.log(response.data.inventoryAdjustQuantities.inventoryAdjustmentGroup.changes);
		if (response.data.inventoryAdjustQuantities.userErrors.length) {
			return { success: false, error: response.data.inventoryAdjustQuantities.userErrors };
		}

		return { success: true };
	} catch (error) {
		console.error("Error adjusting inventory:", error);
		return { success: false, error };
	}
};

const createStagedUploads = async (file) => {
	const input = {
		filename: file.name,
		mimeType: file.type,
		resource: "IMAGE",
		fileSize: file.size.toString(),
		httpMethod: "PUT",
	};

	try {
		const response = await client.mutate({
			mutation: STAGED_UPLOADS_CREATE,
			variables: { input: [input] },
		});

		if (response.errors) {
			console.error("GraphQL Errors:", response.errors);
			return { success: false, error: response.errors };
		}

		return { success: true, stagedTargets: response.data.stagedUploadsCreate.stagedTargets };
	} catch (error) {
		console.error("Error creating staged uploads:", error);
		return { success: false, error };
	}
};

const addMediaToProduct = async (productId, media) => {
	try {
		const response = await client.mutate({
			mutation: CREATE_PRODUCT_MEDIA,
			variables: { productId: productId, media: media },
		});
		return { success: true, media: response.data.productCreateMedia };
	} catch (error) {
		console.error("Error adding media to product:", error);
		return { success: false, error };
	}
};

const addPictureToProduct = async (productId, filePath) => {
	const file = {
		path: filePath,
		name: path.basename(filePath),
		type: "image/jpeg",
		size: fs.statSync(filePath).size,
	};
	try {
		const stagedUploadsResult = await createStagedUploads(file);
		if (!stagedUploadsResult.success) {
			return stagedUploadsResult;
		}

		const uploadResult = await uploadFileToStagedURL(
			stagedUploadsResult.stagedTargets[0],
			file
		);
		if (!uploadResult.success) {
			return uploadResult;
		}

		const mediaInput = [
			{
				originalSource: uploadResult.url,
				alt: "Image description",
				mediaContentType: "IMAGE",
			},
		];
		const addMediaResult = await addMediaToProduct(encodeGlobalId(productId), mediaInput);
		return addMediaResult;
	} catch (error) {
		console.error("Error during file upload process:", error);
		return { success: false, error };
	}
};

const getProduct = async (productId) => {
	try {
		const response = await client.query({
			query: GET_PRODUCT_QUERY,
			variables: { id: encodeGlobalId(productId) },
			fetchPolicy: "network-only",
		});

		if (response.data && response.data.product) {
			console.log(
				"Product fetched successfully:",
				JSON.stringify(response.data.product, null, 2)
			);
			return { success: true, product: response.data.product };
		} else {
			console.error("Failed to fetch product:", response.errors);
			return { success: false, error: response.errors };
		}
	} catch (error) {
		console.error("Error fetching product:", error);
		return { success: false, error };
	}
};

const getPublications = async () => {
	try {
		const response = await client.query({
			query: GET_PUBLICATIONS_QUERY,
		});
		return response.data.publications.edges.map((edge) => ({
			id: edge.node.id,
			name: edge.node.name,
		}));
	} catch (error) {
		console.error("Error fetching publications:", error);
		return [];
	}
};

const publishProductToPOS = async (productId) => {
	const publicationId = process.env.PUBLICATION_POINT_OF_SALE;
	console.log("INSIDE POS OPERATION");
	console.log(productId, "productId");
	console.log(publicationId, "publicationId");

	return await publishProduct(productId, [publicationId]);
};

module.exports = {
	uploadFileToStagedURL,
	createProduct,
	publishProduct,
	updateProduct,
	updateVariant,
	adjustInventory,
	updateInventoryItem,
	createStagedUploads,
	addPictureToProduct,
	getProduct,
	getPublications,
	publishProductToPOS,
};
