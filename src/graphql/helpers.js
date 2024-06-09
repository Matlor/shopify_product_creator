const encodeGlobalId = (id) => Buffer.from(`gid://shopify/Product/${id}`).toString("base64");
const encodeVariantId = (variantId) =>
	Buffer.from(`gid://shopify/ProductVariant/${variantId}`).toString("base64");
const extractNumericId = (idString) => idString.split("/").pop();

module.exports = {
	encodeGlobalId,
	encodeVariantId,
	extractNumericId,
};
