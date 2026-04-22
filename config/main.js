const { app, BrowserWindow, Menu, nativeTheme, session } = require('electron') // ← agrega session
const path = require('path');

Menu.setApplicationMenu(null);
nativeTheme.themeSource = 'dark';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: 'icon.png',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  
      nodeIntegration: false,
    }
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  // ← Agrega esto antes de createWindow()
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === 'geolocation') {
        callback(true) // ← permite ubicación
      } else {
        callback(false)
      }
    }
  )

  createWindow()
})