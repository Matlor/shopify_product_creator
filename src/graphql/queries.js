const { gql } = require("@apollo/client/core");

const GET_PRODUCT_QUERY = gql`
	query getProduct($id: ID!) {
		product(id: $id) {
			id
			title
			descriptionHtml
			productType
			vendor
			createdAt
			variants(first: 5) {
				edges {
					node {
						id
						title
						price
						sku
					}
				}
			}
			images(first: 3) {
				edges {
					node {
						src
						altText
					}
				}
			}
		}
	}
`;

module.exports = {
	GET_PRODUCT_QUERY,
};
