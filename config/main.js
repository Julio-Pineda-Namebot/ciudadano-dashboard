const { app, BrowserWindow, Menu, MenuItem, nativeTheme, session, dialog, systemPreferences, ipcMain } = require('electron')
const path = require('path');
const os = require('os');

const { setupUpdates } = require('./updater');
setupUpdates();

nativeTheme.themeSource = 'dark';

ipcMain.on('get-device-name', (event) => {
  const hostname = os.hostname()
  const platform = os.platform()
  const release = os.release()
  const platformLabel =
    platform === 'win32' ? `Windows ${release.split('.')[0] === '10' ? '10/11' : release}` :
    platform === 'darwin' ? `macOS ${release}` :
    platform === 'linux' ? `Linux ${release}` :
    `${platform} ${release}`
  event.returnValue = `${hostname} (${platformLabel})`
})

ipcMain.on('window:minimize', () => {
  BrowserWindow.getFocusedWindow()?.minimize()
})

ipcMain.on('window:maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.isMaximized() ? win.unmaximize() : win.maximize()
})

ipcMain.on('window:close', () => {
  BrowserWindow.getFocusedWindow()?.close()
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    backgroundColor: '#0a0a0a',
    autoHideMenuBar: true,
    frame: process.platform === 'darwin',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    fullscreen: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  const PROD_URL = 'https://ciudadano-dashboard.vercel.app';
  win.loadURL(app.isPackaged ? PROD_URL : 'http://localhost:3000');

  win.webContents.on('context-menu', (_event, params) => {
    const { isEditable, selectionText, editFlags } = params
    const hasSelection = selectionText && selectionText.trim().length > 0

    if (!isEditable && !hasSelection) return

    const menu = new Menu()

    if (isEditable) {
      menu.append(new MenuItem({
        label: 'Cortar',
        role: 'cut',
        enabled: editFlags.canCut && hasSelection,
      }))
    }

    if (hasSelection || isEditable) {
      menu.append(new MenuItem({
        label: 'Copiar',
        role: 'copy',
        enabled: editFlags.canCopy && hasSelection,
      }))
    }

    if (isEditable) {
      menu.append(new MenuItem({
        label: 'Pegar',
        role: 'paste',
        enabled: editFlags.canPaste,
      }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({
        label: 'Seleccionar todo',
        role: 'selectAll',
        enabled: editFlags.canSelectAll,
      }))
    }

    if (menu.items.length > 0) {
      menu.popup({ window: win })
    }
  })
}

app.whenReady().then(async () => {
  if (process.platform === 'darwin') {
    try { app.dock.setIcon(path.join(__dirname, '..', 'assets', 'icon.png')) } catch {}
    try { await systemPreferences.askForMediaAccess('camera') } catch {}
  }

  session.defaultSession.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      if (permission === 'geolocation') {
        dialog.showMessageBox({
          type: 'question',
          buttons: ['Permitir', 'Denegar'],
          defaultId: 0,
          title: 'Permiso de ubicación',
          message: 'Ciudadano Dashboard quiere acceder a tu ubicación',
          detail: 'Esto permite mostrar tu posición en el mapa de incidentes.',
        }).then(({ response }) => {
          callback(response === 0)
        })
      } else if (permission === 'media') {
        callback(true)
      } else {
        callback(false)
      }
    }
  )

  session.defaultSession.setPermissionCheckHandler((_wc, permission) => {
    if (permission === 'media') return true
    return false
  })

  createWindow()
})
