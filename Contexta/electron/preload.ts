import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("contexta", {
  platform: () => ipcRenderer.invoke("contexta:platform"),
});
