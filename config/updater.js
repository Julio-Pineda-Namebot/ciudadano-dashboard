const { app, dialog, shell } = require('electron');

const GITHUB_OWNER = 'Julio-Pineda-Namebot';
const GITHUB_REPO = 'ciudadano-dashboard';

// Compara "1.0.4" vs "1.0.3" -> true si remote es mayor.
function isNewerVersion(remote, local) {
  const r = remote.replace(/^v/, '').split('.').map(Number);
  const l = local.replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < Math.max(r.length, l.length); i++) {
    if ((r[i] || 0) > (l[i] || 0)) return true;
    if ((r[i] || 0) < (l[i] || 0)) return false;
  }
  return false;
}

// macOS (y cualquier app sin firmar): aviso manual de nueva versión.
async function checkForUpdatesManually() {
  if (!app.isPackaged) return; // no chequear en desarrollo
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    if (!res.ok) return;
    const release = await res.json();
    const latest = release.tag_name || '';
    if (!isNewerVersion(latest, app.getVersion())) return;

    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['Descargar', 'Más tarde'],
      defaultId: 0,
      cancelId: 1,
      title: 'Actualización disponible',
      message: `Hay una nueva versión (${latest}) disponible.`,
      detail: `Tienes la versión ${app.getVersion()}. ¿Quieres descargar la última?`,
    });
    if (response === 0) {
      shell.openExternal(release.html_url);
    }
  } catch (err) {
    console.error('Error al buscar actualizaciones:', err);
  }
}

// Windows: auto-update real (Squirrel funciona sin firma).
// macOS: aviso manual (no se puede auto-actualizar sin firma de Apple).
function setupUpdates() {
  if (process.platform === 'win32') {
    const { updateElectronApp } = require('update-electron-app');
    updateElectronApp({ updateInterval: '10 minutes', logger: console, notifyUser: true });
  } else if (process.platform === 'darwin') {
    checkForUpdatesManually();
  }
}

module.exports = { setupUpdates };
