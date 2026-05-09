const { app, BrowserWindow, Menu, nativeTheme, session, dialog, systemPreferences } = require('electron')
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

app.whenReady().then(async () => {
  // En macOS hay que pedirle al SO permiso de cámara antes que al usuario.
  if (process.platform === 'darwin') {
    try { await systemPreferences.askForMediaAccess('camera') } catch {}
  }

  // ← Pide permiso al usuario con diálogo
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === 'geolocation') {
        dialog.showMessageBox({
          type: 'question',
          buttons: ['Permitir', 'Denegar'],
          defaultId: 0,
          title: 'Permiso de ubicación',
          message: 'Ciudadano Dashboard quiere acceder a tu ubicación',
          detail: 'Esto permite mostrar tu posición en el mapa de incidentes.',
        }).then(({ response }) => {
          callback(response === 0) // 0 = Permitir, 1 = Denegar
        })
      } else if (permission === 'media') {
        callback(true)
      } else {
        callback(false)
      }
    }
  )

  // Algunas versiones de Electron consultan vía permission check (síncrono).
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => {
    if (permission === 'media') return true
    return false
  })

  createWindow()
})