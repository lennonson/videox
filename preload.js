const { contextBridge, ipcRenderer } = require('electron');
openFileDialog: () => ipcRenderer.invoke('open-file-dialog')

contextBridge.exposeInMainWorld('api', {
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),  // 修正 'maxmize' 为 'maximize'
    closeWindow: () => ipcRenderer.send('close-window'),
    sendMessage: (message) => ipcRenderer.invoke('chat-message', message),
});
