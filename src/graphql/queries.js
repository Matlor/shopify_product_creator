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

const GET_PUBLICATIONS_QUERY = gql`
	query {
		publications(first: 10) {
			edges {
				node {
					id
					name
				}
			}
		}
	}
`;

const GET_LOCATIONS_QUERY = gql`
	query GetLocations {
		locations(first: 5) {
			edges {
				node {
					id
					name
				}
			}
		}
	}
`;

module.exports = {
	GET_PRODUCT_QUERY,
	GET_PUBLICATIONS_QUERY,
	GET_LOCATIONS_QUERY,
};
