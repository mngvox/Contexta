"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const createWindow = () => {
    const window = new electron_1.BrowserWindow({
        width: 1500,
        height: 960,
        minWidth: 1120,
        minHeight: 720,
        titleBarStyle: "hiddenInset",
        vibrancy: "under-window",
        backgroundColor: "#12110f",
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    const devUrl = process.env.VITE_DEV_SERVER_URL;
    if (devUrl)
        window.loadURL(devUrl);
    else
        window.loadFile(node_path_1.default.join(__dirname, "../dist/index.html"));
    window.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https://"))
            electron_1.shell.openExternal(url);
        return { action: "deny" };
    });
};
electron_1.app.whenReady().then(() => {
    electron_1.ipcMain.handle("contexta:platform", () => process.platform);
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
