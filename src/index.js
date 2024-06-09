const chokidar = require("chokidar");
const { createProduct, addPictureToProduct } = require("./graphql/operations");
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
			} else {
				// ---------- add picture ----------
				const productId = extractNumericId(createdProductResult.product.product.id);
				const addPicResult = await addPictureToProduct(productId, filePath);
				if (!addPicResult.success) {
					console.error("Failed to add picture to product:", addPicResult.error);
					return;
				} else {
					// ---------- delete, refresh, print ----------
					deleteFile(filePath);
					refreshShopifyTab();
					//printLabel(productId);
				}
			}
		} catch (error) {
			console.error("Error processing file:", error);
		}
	})
	.on("error", (error) => console.error(`Watcher error: ${error}`))
	.on("ready", () =>
		console.log(`Initial scan complete. Ready for changes in ${FOLDER_TO_WATCH}`)
	);
