const defaultProduct = {
	title: "Title Placeholder",
	descriptionHtml: "<p>Description Placeholder</p>",
	productType: "Product Type Placeholder",
	vendor: "Vendor Placeholder",
	tags: ["Tags Placeholder"],
	/* publicationIds: [
		process.env.PUBLICATION_POINT_OF_SALE,
		process.env.PUBLICATION_ONLINE_STORE,
		process.env.PUBLICATION_SHOP,
	], -> don't think this has worked*/
	//publishedAt: new Date().toISOString(), // Publish immediately
};

module.exports = {
	defaultProduct,
};
