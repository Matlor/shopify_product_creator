const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire ipcRenderer object
contextBridge.exposeInMainWorld("electron", {
	getProduct: (productId) => ipcRenderer.invoke("get-product", productId),

	//---
	getImages: () => ipcRenderer.invoke("get-images"),
	getEntries: () => ipcRenderer.invoke("get-entries"),
	saveEntries: (entries) => ipcRenderer.invoke("save-entries", entries),

	setStore: (storeCase) => ipcRenderer.invoke("set-store", storeCase),

	createShopifyEntries: (filePaths) => ipcRenderer.invoke("create-shopify-entries", filePaths),

	runTest: () => ipcRenderer.invoke("run-test"),
});
