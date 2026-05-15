const { app, BrowserWindow, Menu, MenuItem, nativeTheme, session, dialog, systemPreferences } = require('electron')
const path = require('path');

// Registrar menú vacío pero con roles de edición para que Ctrl+C/V/X/Z funcionen
const editMenu = Menu.buildFromTemplate([{
  label: 'Edit',
  submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { role: 'selectAll' },
  ],
}])

Menu.setApplicationMenu(editMenu);
nativeTheme.themeSource = 'dark';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadURL('http://localhost:3000');

  // Context menu nativo en click derecho con opciones de edición
  win.webContents.on('context-menu', (_event, params) => {
    const { isEditable, selectionText, editFlags } = params
    const hasSelection = selectionText && selectionText.trim().length > 0

    // Solo mostrar si hay texto seleccionado o el elemento es editable
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