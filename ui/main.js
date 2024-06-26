const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1600,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
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
