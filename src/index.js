const chokidar = require("chokidar");
const {
	createProduct,
	updateVariant,
	addPictureToProduct,
	publishProductToPOS,
	publishProduct,
} = require("./graphql/operations");
const { extractNumericId, encodeGlobalId } = require("./graphql/helpers");
const printLabel = require("./labelprinter/print");
const refreshShopifyTab = require("./scripts/refresh");
const { isValidImage, deleteFile } = require("./utils/fileUtils");
const { defaultProduct } = require("./graphql/shopifyProductDetails");
const { generateShortUniqueId } = require("./utils/fileUtils");

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

			const productId = createdProductResult.product.id;
			console.log("Created product ID:", productId);

			// ---------- update product variant with barcode ----------

			const variantId = createdProductResult.product.variants.edges[0].node.id;
			console.log(extractNumericId(variantId), "variantId");

			const barcode = generateShortUniqueId();

			const updateVariantResult = await updateVariant(extractNumericId(variantId), {
				barcode,
			});
			if (!updateVariantResult.success) {
				console.error("Failed to update variant with barcode:", updateVariantResult.error);
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
			printLabel(barcode);
		} catch (error) {
			console.error("Error processing file:", error);
		}
	})
	.on("error", (error) => console.error(`Watcher error: ${error}`))
	.on("ready", () =>
		console.log(`Initial scan complete. Ready for changes in ${FOLDER_TO_WATCH}`)
	);
