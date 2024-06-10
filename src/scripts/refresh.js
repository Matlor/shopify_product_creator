const { exec } = require("child_process");

const refreshShopifyTab = () => {
	exec(
		"osascript /Users/mathiaslorenceau/Code/shopify_product_creator/src/scripts/refresh_shopify_chrome.scpt",
		(error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing AppleScript: ${error}`);
				return;
			}
			console.log("Shopify tab refreshed successfully:", stdout);
		}
	);
};

module.exports = refreshShopifyTab;
