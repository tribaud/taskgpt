import { contextBridge, ipcRenderer } from 'electron';

// Define types for our API
interface ElectronAPI {
  saveApiKey: (apiKey: string) => Promise<any>;
  getApiKey: () => Promise<any>;
  saveFile: (data: any, defaultPath?: string) => Promise<any>;
  openFile: () => Promise<any>;
}

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // API key handling
  saveApiKey: (apiKey: string) => ipcRenderer.invoke('save-api-key', apiKey),
  getApiKey: () => ipcRenderer.invoke('get-api-key'),

  // File operations
  saveFile: (data: any, defaultPath?: string) => ipcRenderer.invoke('save-file', data, defaultPath),
  openFile: () => ipcRenderer.invoke('open-file'),

  // Add more API methods here as needed
} as ElectronAPI);
