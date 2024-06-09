const chokidar = require("chokidar");
const { createProduct, addPictureToProduct, extractNumericId } = require("./apollo");
const path = require("path"); // Ensure this is at the top of your file
const fs = require("fs"); // Require the filesystem module
const { exec } = require("child_process");

// Function to execute AppleScript
function refreshShopifyTab() {
	exec(
		"osascript /Users/mathiaslorenceau/Code/shopify_product_creator/refresh_shopify_chrome.scpt",
		(error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing AppleScript: ${error}`);
				return;
			}
			console.log("Shopify tab refreshed successfully:", stdout);
		}
	);
}

// Folder to watch
const folderToWatch =
	"/Users/mathiaslorenceau/Documents/entrepreneurial_projects/vintage_collective/foto_station/foto_station";

const watcher = chokidar.watch(folderToWatch, {
	ignored: /^\./,
	persistent: true,
});

watcher
	.on("add", async (filePath) => {
		console.log(`File ${filePath} has been added`);

		// Check if the file is an image
		const validImageTypes = [".jpg", ".jpeg", ".png", ".gif"];
		const ext = path.extname(filePath).toLowerCase();

		if (!validImageTypes.includes(ext)) {
			console.log(`Ignored non-image file: ${filePath}`);
			return; // Skip processing for non-image files
		}

		try {
			const newProductDetails = {
				title: "Title Placeholder",
				descriptionHtml: "<p>Description Placeholder</p>",
				productType: "Product Type Placeholder",
				vendor: "Vendor Placeholder",
				tags: ["Tags Placeholder"],
			};

			const createdProduct = await createProduct(newProductDetails);

			if (createdProduct && createdProduct.product) {
				console.log("Product id created successfully:", createdProduct.product.id);

				// Pic
				const productId = extractNumericId(createdProduct.product.id);
				const addPicRes = await addPictureToProduct(productId, filePath);
				console.log(addPicRes, "Picture added to product");
				//-----------------
				refreshShopifyTab();
				// -------------------

				// If the picture is successfully added, delete it
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file ${filePath}: ${err}`);
					} else {
						console.log(`File ${filePath} was deleted successfully`);
					}
				});
				// -------------------
			}
		} catch (error) {
			console.error("Error processing file:", error);
		}
	})
	.on("error", (error) => console.error(`Watcher error: ${error}`))
	.on("ready", () => console.log(`Initial scan complete. Ready for changes in ${folderToWatch}`));
