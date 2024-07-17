const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { getProduct } = require("../src/graphql/operations");
const test = require("../src/debugging");

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

// IPC handlers
ipcMain.handle("get-product", async (event, productId) => {
	try {
		const result = await getProduct(productId);
		return result;
	} catch (error) {
		return { success: false, error: error.message };
	}
});

// IPC handlers
ipcMain.handle("get-file", async (event, productId) => {
	try {
		const result = await test();
		return result;
	} catch (error) {
		return { success: false, error: error.message };
	}
});
