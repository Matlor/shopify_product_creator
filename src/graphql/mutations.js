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
				publishedAt # Ensure this field is included
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
	UPDATE_VARIANT_MUTATION,
	STAGED_UPLOADS_CREATE,
	CREATE_PRODUCT_MEDIA,
};
