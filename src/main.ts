import { app, BrowserWindow, ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import Store from 'electron-store';

// Define types for our data structures
interface SaveFileResult {
  canceled?: boolean;
  success?: boolean;
  filePath?: string;
  error?: string;
}

interface OpenFileResult {
  canceled?: boolean;
  success?: boolean;
  data?: any;
  filePath?: string;
  error?: string;
}

interface ApiKeyResult {
  apiKey?: string;
  success?: boolean;
}

// Initialize electron-store for secure API key storage
const store = new Store();

// Global reference to mainWindow to prevent garbage collection
let mainWindow: BrowserWindow | null = null;

// Create the application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Open DevTools in development mode
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle API key storage
ipcMain.handle('save-api-key', async (_event: IpcMainInvokeEvent, apiKey: string): Promise<ApiKeyResult> => {
  store.set('openai-api-key', apiKey);
  return { success: true };
});

// Handle API key retrieval
ipcMain.handle('get-api-key', async (): Promise<ApiKeyResult> => {
  const apiKey = store.get('openai-api-key') as string;
  return { apiKey };
});

// Handle file saving
ipcMain.handle('save-file', async (_event: IpcMainInvokeEvent, data: any, defaultPath?: string): Promise<SaveFileResult> => {
  if (!mainWindow) {
    return { success: false, error: 'Main window is not available' };
  }

  const result: any = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath || 'tasks.json',
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  // Check if the result has the expected properties
  if (result && result.canceled !== undefined) {
    if (result.canceled) {
      return { canceled: true };
    }
  } else {
    // Handle case where result is just a string (filePath)
    if (!result || result === '') {
      return { canceled: true };
    }
  }

  try {
    const fs = require('fs');
    const filePath = result.filePath || result;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { success: true, filePath };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Handle file opening
ipcMain.handle('open-file', async (_event: IpcMainInvokeEvent): Promise<OpenFileResult> => {
  if (!mainWindow) {
    return { success: false, error: 'Main window is not available' };
  }

  const result: any = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  // Check if the result has the expected properties
  if (result && result.canceled !== undefined) {
    if (result.canceled) {
      return { canceled: true };
    }
  } else {
    // Handle case where result is just an array of filePaths
    if (!result || result.length === 0) {
      return { canceled: true };
    }
  }

  try {
    const fs = require('fs');
    const filePaths = result.filePaths || result;
    const data = fs.readFileSync(filePaths[0], 'utf8');
    const parsed = JSON.parse(data);
    return { success: true, data: parsed, filePath: filePaths[0] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// App lifecycle events
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
