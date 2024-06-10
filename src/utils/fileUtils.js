const fs = require("fs");
const path = require("path");
const randomatic = require("randomatic");

const isValidImage = (filePath, validImageTypes) => {
	const ext = path.extname(filePath).toLowerCase();
	return validImageTypes.includes(ext);
};

const deleteFile = (filePath) => {
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error(`Error deleting file ${filePath}: ${err}`);
		} else {
			console.log(`File ${filePath} was deleted successfully`);
		}
	});
};

const generateShortUniqueId = () => {
	return randomatic("0", 8);
};

module.exports = generateShortUniqueId;

module.exports = {
	isValidImage,
	deleteFile,
	generateShortUniqueId,
};
