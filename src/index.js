const chokidar = require("chokidar");
const {
	createProduct,
	addPictureToProduct,
	publishProductToPOS,
	publishProduct,
} = require("./graphql/operations");
const { extractNumericId } = require("./graphql/helpers");
const printLabel = require("./labelprinter/print");
const refreshShopifyTab = require("./scripts/refresh");
const { isValidImage, deleteFile } = require("./utils/fileUtils");
const { defaultProduct } = require("./graphql/shopifyProductDetails");

const FOLDER_TO_WATCH =
	"/Users/mathiaslorenceau/Documents/entrepreneurial_projects/vintage_collective/foto_station/foto_station";

const watcher = chokidar.watch(FOLDER_TO_WATCH, {
	ignored: /^\./,
	persistent: true,
});

watcher
	.on("add", async (filePath) => {
		console.log("before valid image");
		if (!isValidImage(filePath, [".jpg", ".jpeg", ".png", ".gif"])) {
			return;
		}

		try {
			// ---------- create product ----------
			const createdProductResult = await createProduct(defaultProduct);
			if (!createdProductResult.success) {
				console.error("Failed to create product:", createdProductResult.error);
				return;
			}

			console.log(createdProductResult, "createdProductResult");
			const productId = createdProductResult.product.product.id;

			// ---------- publish product to POS ----------
			const publishPOSResult = await publishProductToPOS(productId);
			if (!publishPOSResult.success) {
				console.error("Failed to publish product to POS:", publishPOSResult.error);
				return;
			}
			console.log(publishPOSResult.publication, "publishPOSResult.publication");

			// ---------- publish product to other channels ----------
			/* 	const otherPublicationIds = [
				process.env.PUBLICATION_ONLINE_STORE,
				process.env.PUBLICATION_SHOP,
			];
			const publishOtherResult = await publishProduct(productId, otherPublicationIds);
			if (!publishOtherResult.success) {
				console.error(
					"Failed to publish product to other channels:",
					publishOtherResult.error
				);
				return;
			}
 */
			// ---------- add picture ----------
			console.log(productId, "productId");
			const numericProductId = extractNumericId(productId);
			console.log(numericProductId, "numericProductId");
			const addPicResult = await addPictureToProduct(numericProductId, filePath);
			if (!addPicResult.success) {
				console.error("Failed to add picture to product:", addPicResult.error);
				return;
			}

			// ---------- delete, refresh, print ----------
			deleteFile(filePath);
			refreshShopifyTab();
			//printLabel(numericProductId);
		} catch (error) {
			console.error("Error processing file:", error);
		}
	})
	.on("error", (error) => console.error(`Watcher error: ${error}`))
	.on("ready", () =>
		console.log(`Initial scan complete. Ready for changes in ${FOLDER_TO_WATCH}`)
	);
