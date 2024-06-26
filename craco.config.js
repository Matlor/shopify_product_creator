const path = require("path");

module.exports = {
	webpack: {
		configure: (webpackConfig, { env, paths }) => {
			paths.appBuild = path.resolve(__dirname, "ui/build");
			paths.appPublic = path.resolve(__dirname, "ui/public");
			paths.appHtml = path.resolve(__dirname, "ui/public/index.html");
			paths.appIndexJs = path.resolve(__dirname, "ui/src/index.js");
			webpackConfig.entry = path.resolve(__dirname, "ui/src/index.js");
			webpackConfig.output = {
				...webpackConfig.output,
				path: path.resolve(__dirname, "ui/build"),
				publicPath: "./", // Ensures all assets are loaded relative to index.html
			};
			return webpackConfig;
		},
	},
	paths: {
		appBuild: path.resolve(__dirname, "ui/build"),
		appPublic: path.resolve(__dirname, "ui/public"),
		appHtml: path.resolve(__dirname, "ui/public/index.html"),
		appIndexJs: path.resolve(__dirname, "ui/src/index.js"),
	},
	babel: {
		presets: ["@babel/preset-env", "@babel/preset-react"],
	},
};
