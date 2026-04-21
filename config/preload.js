const { contextBridge } = require('electron');
const os = require('os');

function getDeviceName() {
  const hostname = os.hostname();
  const platform = os.platform();
  const release = os.release();

  const platformLabel =
    platform === 'win32' ? `Windows ${release.split('.')[0] === '10' ? '10/11' : release}` :
    platform === 'darwin' ? `macOS ${release}` :
    platform === 'linux' ? `Linux ${release}` :
    `${platform} ${release}`;

  return `${hostname} (${platformLabel})`;
}

contextBridge.exposeInMainWorld('electron', {
  getDeviceName,
});
