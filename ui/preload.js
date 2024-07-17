const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire ipcRenderer object
contextBridge.exposeInMainWorld("electronAPI", {
	getProduct: (productId) => ipcRenderer.invoke("get-product", productId),
	getFile: () => ipcRenderer.invoke("get-file"),
});
