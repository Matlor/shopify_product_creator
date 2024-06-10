const { getPublications } = require("./graphql/operations");

const fetchAndDisplayPublications = async () => {
	const publications = await getPublications();
	console.log("Publications:", publications);
};

fetchAndDisplayPublications();
