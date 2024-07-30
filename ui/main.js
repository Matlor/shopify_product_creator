const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { getProduct, setStore } = require("../src/graphql/operations");
const { doProduct, test } = require("../src/uiInterface");
const { setCurrentClient } = require("../src/graphql/client");

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1600,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "./preload.js"),
			nodeIntegration: true,
			contextIsolation: true,
		},
	});

	// Load the index.html file from the build directory
	mainWindow.loadFile(path.join(__dirname, "build/index.html"));
	mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// -------------------------------- IPC HANDLERS --------------------------------
// ------------------------------------------------------------------------------

ipcMain.handle("run-test", async () => {
	return await test();
});

ipcMain.handle("get-product", async (event, productId) => {
	try {
		const result = await getProduct(productId);
		return result;
	} catch (error) {
		return { success: false, error: error.message };
	}
});

ipcMain.handle("get-images", async () => {
	const dirPath =
		"/Users/mathiaslorenceau/Documents/entrepreneurial_projects/Etage/pictures/drop_etage/21.7.24_copy_dev/";
	const files = fs.readdirSync(dirPath);
	const images = files
		.filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg"))
		.map((file) => path.join(dirPath, file));
	return images;
});

ipcMain.handle("get-entries", async () => {
	const jsonFilePath =
		"/Users/mathiaslorenceau/Documents/entrepreneurial_projects/Etage/pictures/drop_etage/21.7.24_copy_dev/entries.json";
	try {
		if (!fs.existsSync(jsonFilePath)) {
			fs.writeFileSync(jsonFilePath, JSON.stringify([]));
		}
		const data = fs.readFileSync(jsonFilePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error("Error reading JSON file:", error);
		return [];
	}
});

ipcMain.handle("save-entries", async (event, entries) => {
	const jsonFilePath =
		"/Users/mathiaslorenceau/Documents/entrepreneurial_projects/Etage/pictures/drop_etage/21.7.24_copy_dev/entries.json";
	try {
		fs.writeFileSync(jsonFilePath, JSON.stringify(entries, null, 2));
		return { success: true };
	} catch (error) {
		console.error("Error writing JSON file:", error);
		return { success: false, error: error.message };
	}
});

ipcMain.handle("create-shopify-entries", async (event, filePaths) => {
	doProduct(filePaths);
});

ipcMain.handle("set-store", async (event, storeCase) => {
	try {
		await setStore(storeCase);
		return { success: true };
	} catch (error) {
		console.error("Error setting store:", error);
		return { success: false, error: error.message };
	}
});
