const fs = require("fs");
const path = require("path");

const imagePath = "/Users/mathiaslorenceau/Desktop/smaller.jpg";
const fileBuffer = fs.readFileSync(imagePath);
const imageBase64 = `data:image/${path.extname(imagePath).slice(1)};base64,${fileBuffer.toString(
	"base64"
)}`;

console.log(imageBase64);
