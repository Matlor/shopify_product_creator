const {
	createProduct,
	updateVariant,
	addPictureToProduct,
	publishProductToPOS,
	publishProduct,
	adjustInventory,
	updateInventoryItem,
	getProduct,
	getSerialisedStore,
	setStore,
} = require("./graphql/operations");
const { defaultProduct } = require("./graphql/productInformation");
const { extractNumericId, encodeGlobalId } = require("./graphql/helpers");
const { isValidImage, deleteFile, generateShortUniqueId } = require("./utils/fileUtils");

/* 
WHAT IS NEEDED HERE
- basic entry
- images
- barcode
- (price until I change func)


*/

const test = async () => {
	return getSerialisedStore();
};

const doProduct = async (filePaths) => {
	/* 
2. Product Creation and Initialization
	•reate Product: Creates a new product using a default template.
	-> shall return ID
*/

	const createdProductResult = await createProduct(defaultProduct);

	/* 
3. Product Variant Update
	•	Update Variant with Barcode
	-> shall return the barcode ID

*/

	const variantId = createdProductResult.product.variants.edges[0].node.id;
	//console.log(variantId, "variantId");
	const barcode = generateShortUniqueId();

	const updateVariantResult = await updateVariant(extractNumericId(variantId), {
		barcode,
		price: 0,
	});

	/* 
4. Inventory Management
	•	Update Inventory Item: Updates the inventory item associated with the product variant.
	•	Adjust Inventory Quantity: Adjusts the inventory quantity for the product at a specific location.
	-> shall return the inventory & quantity

*/

	/* console.log(updateVariantResult, "updateVariantResult");
	const updateInventoryItemResult = await updateInventoryItem(
		updateVariantResult.variant.inventoryItem.id
	);

	const locationId = "gid://shopify/Location/92197388621";
	const availableDelta = 1;
	const adjustInventoryResult = await adjustInventory(
		updateVariantResult.variant.inventoryItem.id,
		locationId,
		availableDelta
	); */

	/* 
5. Product Publishing
	•	Publish to POS: Publishes the product to the Point of Sale (POS) channel.
	•	Publish to Other Channels: Publishes the product to additional sales channels such as the online store.
	-> shall return the publish ids or so
*/

	/* console.log(createdProductResult.product.id);
	const publishPOSResult = await publishProductToPOS(
		extractNumericId(createdProductResult.product.id)
	);

	const otherPublicationIds = [
		process.env.PUBLICATION_ONLINE_STORE,
		process.env.PUBLICATION_SHOP,
	];
	const publishOtherResult = await publishProduct(
		encodeGlobalId(createdProductResult.product.id),
		otherPublicationIds
	);
 */
	/* 

6. Image and Finalization
	•	Add Picture to Product: Adds the newly detected image file to the created product.
	•	Cleanup and Post-processing: Deletes the processed file, refreshes the Shopify tab, and prints the product label with the barcode and price.
*/

	const numericProductId = extractNumericId(createdProductResult.product.id);

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	for (const path of filePaths) {
		const addPicResult = await addPictureToProduct(numericProductId, path);
		if (!addPicResult.success) {
			console.error(`Failed to add picture ${path} to product:`, addPicResult.error);
		}
		await delay(50);
	}
};

module.exports = {
	doProduct,
	test,
};
