/* THIS WAS FOR DEBUGGING AND CAN BE COMPLETELY DELETED BUT I SHOULD GO IN THAT DIRECTIONS */

const { createProduct, addPictureToProduct, extractNumericId } = require("./apollo");
const dotenv = require("dotenv");
dotenv.config();

(async () => {
	console.log(process.env, "process.env");

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
			console.log(productId, "productId");
		} else {
			console.log("something didn't work");
		}
	} catch (error) {
		console.error("Error processing file:", error);
	}
})();
