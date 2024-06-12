const { gql } = require("@apollo/client/core");

const CREATE_PRODUCT_MUTATION = gql`
	mutation CreateProduct($input: ProductInput!) {
		productCreate(input: $input) {
			product {
				id
				title
				descriptionHtml
				productType
				vendor
				tags
				publishedAt
				variants(first: 1) {
					edges {
						node {
							id
							price
							barcode
						}
					}
				}
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const PUBLISHABLE_PUBLISH_MUTATION = gql`
	mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
		publishablePublish(id: $id, input: $input) {
			userErrors {
				field
				message
			}
		}
	}
`;

const UPDATE_PRODUCT_MUTATION = gql`
	mutation UpdateProduct($input: ProductInput!) {
		productUpdate(input: $input) {
			product {
				id
				title
				descriptionHtml
				productType
				vendor
				tags
				publishedAt # Ensure this field is included
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const UPDATE_VARIANT_MUTATION = gql`
	mutation UpdateVariant($input: ProductVariantInput!) {
		productVariantUpdate(input: $input) {
			productVariant {
				id
				price
				barcode
				inventoryPolicy
				inventoryQuantity
				inventoryItem {
					id
					sku
					tracked
				}
				inventoryQuantity
				availableForSale
				createdAt
				updatedAt
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const INVENTORY_ITEM_UPDATE_MUTATION = gql`
	mutation inventoryItemUpdate($id: ID!, $input: InventoryItemUpdateInput!) {
		inventoryItemUpdate(id: $id, input: $input) {
			inventoryItem {
				id
				tracked
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const INVENTORY_ADJUST_QUANTITIES_MUTATION = gql`
	mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
		inventoryAdjustQuantities(input: $input) {
			inventoryAdjustmentGroup {
				createdAt
				reason
				referenceDocumentUri
				changes {
					name
					delta
				}
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const STAGED_UPLOADS_CREATE = gql`
	mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
		stagedUploadsCreate(input: $input) {
			stagedTargets {
				url
				resourceUrl
				parameters {
					name
					value
				}
			}
			userErrors {
				field
				message
			}
		}
	}
`;

const CREATE_PRODUCT_MEDIA = gql`
	mutation CreateProductMedia($productId: ID!, $media: [CreateMediaInput!]!) {
		productCreateMedia(productId: $productId, media: $media) {
			media {
				alt
				mediaContentType
				status
				id
				mediaErrors {
					code
					details
					message
				}
				mediaWarnings {
					code
					message
				}
			}
			product {
				id
			}
			mediaUserErrors {
				code
				field
				message
			}
		}
	}
`;

module.exports = {
	CREATE_PRODUCT_MUTATION,
	PUBLISHABLE_PUBLISH_MUTATION,
	UPDATE_PRODUCT_MUTATION,
	INVENTORY_ADJUST_QUANTITIES_MUTATION,
	INVENTORY_ITEM_UPDATE_MUTATION,
	UPDATE_VARIANT_MUTATION,
	STAGED_UPLOADS_CREATE,
	CREATE_PRODUCT_MEDIA,
};
