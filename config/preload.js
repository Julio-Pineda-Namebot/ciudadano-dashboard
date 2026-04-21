const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saludar: () => 'Hola seguro 👌'
});