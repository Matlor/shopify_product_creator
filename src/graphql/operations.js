const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("cross-fetch");
const client = require("./client");
const {
	CREATE_PRODUCT_MUTATION,
	UPDATE_PRODUCT_MUTATION,
	UPDATE_VARIANT_MUTATION,
	STAGED_UPLOADS_CREATE,
	CREATE_PRODUCT_MEDIA,
} = require("./mutations");
const { GET_PRODUCT_QUERY } = require("./queries");
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
		return { success: true, product: productResponse.data.productCreate };
	} catch (error) {
		console.error("Error creating product:", error);
		return { success: false, error };
	}
};

const updateProductAndVariants = async (productId, productUpdates, variantUpdates) => {
	try {
		await client.mutate({
			mutation: UPDATE_PRODUCT_MUTATION,
			variables: { input: { id: encodeGlobalId(productId), ...productUpdates } },
		});

		for (const variant of variantUpdates) {
			const encodedVariantId = encodeVariantId(variant.id);

			await client.mutate({
				mutation: UPDATE_VARIANT_MUTATION,
				variables: { input: { id: encodedVariantId, price: variant.price } },
			});
		}
		return { success: true };
	} catch (error) {
		console.error("Error updating product or variant:", error);
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

module.exports = {
	uploadFileToStagedURL,
	createProduct,
	updateProductAndVariants,
	createStagedUploads,
	addPictureToProduct,
	getProduct,
};
