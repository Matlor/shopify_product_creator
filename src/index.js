const chokidar = require("chokidar");
const {
	createProduct,
	updateVariant,
	addPictureToProduct,
	publishProductToPOS,
	publishProduct,
	adjustInventory,
	updateInventoryItem,
	getProductInventoryDetails,
	getLocationId,
} = require("./graphql/operations");
const { defaultProduct } = require("./graphql/shopifyProductDetails");
const { extractNumericId, encodeGlobalId } = require("./graphql/helpers");
const { isValidImage, deleteFile, generateShortUniqueId } = require("./utils/fileUtils");

const printLabel = require("./labelprinter/print");
const refreshShopifyTab = require("./scripts/refresh");
//const fs = require("fs");

const readline = require("readline");

const FOLDER_TO_WATCH =
	"/Users/mathiaslorenceau/Documents/entrepreneurial_projects/vintage_collective/foto_station/foto_station/capture";

function promptForPrice() {
	return new Promise((resolve, reject) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question("Enter the price for the item: ", (price) => {
			rl.close();
			resolve(Number(price)); // Resolve the promise with the price
		});
	});
}

const watcher = chokidar.watch(FOLDER_TO_WATCH, {
	ignored: /^\./,
	persistent: true,
});

watcher
	.on("add", async (filePath) => {
		if (!isValidImage(filePath, [".jpg", ".jpeg", ".png", ".gif"])) {
			return;
		}

		const newPrice = await promptForPrice();
		// Example new price

		try {
			// ---------- create product ----------
			const createdProductResult = await createProduct(defaultProduct);
			if (!createdProductResult.success) {
				console.error("Failed to create product:", createdProductResult.error);
				return;
			}

			const productId = createdProductResult.product.id;

			// ---------- update product variant with barcode and price ----------
			const variantId = createdProductResult.product.variants.edges[0].node.id;

			const barcode = generateShortUniqueId();

			const updateVariantResult = await updateVariant(extractNumericId(variantId), {
				barcode,
				price: newPrice,
			});

			if (!updateVariantResult.success) {
				console.error(
					"Failed to update variant with barcode and price:",
					updateVariantResult.error
				);
				return;
			}

			const price = updateVariantResult.variant.price;
			const inventoryItemId = updateVariantResult.variant.inventoryItem.id;

			// ---------- update inventory item ----------
			const updateInventoryItemResult = await updateInventoryItem(inventoryItemId);
			if (!updateInventoryItemResult.success) {
				console.error("Failed to update inventory item:", updateInventoryItemResult.error);
				return;
			}

			// ---------- get location ID ----------
			const locationId = "gid://shopify/Location/92197388621";

			// ---------- adjust inventory quantity ----------
			const availableDelta = 1; // Example inventory adjustment
			const adjustInventoryResult = await adjustInventory(
				inventoryItemId,
				locationId,
				availableDelta
			);
			if (!adjustInventoryResult.success) {
				console.error("Failed to adjust inventory quantity:", adjustInventoryResult.error);
				return;
			}

			// ---------- publish product to POS ----------
			const publishPOSResult = await publishProductToPOS(extractNumericId(productId));
			if (!publishPOSResult.success) {
				console.error("Failed to publish product to POS:", publishPOSResult.error);
				return;
			}

			// ---------- publish product to other channels ----------
			const otherPublicationIds = [
				process.env.PUBLICATION_ONLINE_STORE,
				process.env.PUBLICATION_SHOP,
			];
			const publishOtherResult = await publishProduct(
				encodeGlobalId(productId),
				otherPublicationIds
			);
			if (!publishOtherResult.success) {
				console.error(
					"Failed to publish product to other channels:",
					publishOtherResult.error
				);
				return;
			}

			// ---------- add picture ----------
			const numericProductId = extractNumericId(productId);
			const addPicResult = await addPictureToProduct(numericProductId, filePath);
			if (!addPicResult.success) {
				console.error("Failed to add picture to product:", addPicResult.error);
				return;
			}

			// ---------- delete, refresh, print ----------
			deleteFile(filePath);
			refreshShopifyTab();
			printLabel(barcode, price);
		} catch (error) {
			console.error("Error processing file:", error);
		}
	})
	.on("error", (error) => console.error(`Watcher error: ${error}`))
	.on("ready", () =>
		console.log(`Initial scan complete. Ready for changes in ${FOLDER_TO_WATCH}`)
	);
