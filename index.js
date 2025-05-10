const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { dialog } = require('electron');
// const OpenAI = require('openai');

// 通过环境变量获取 API 密钥
// const client = new OpenAI({
//     apiKey: "sk-TWmXsTf9g9akzCloIehe57ru1gPbDj1lhyoK3CDE4fuQ4OYM",  // 确保你已经在环境变量中设置了 OPENAI_API_KEY
//     baseURL: "https://api.moonshot.cn/v1",
// });

// let history = [
//     {
//         role: "system",
//         content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。。"
//     }
// ];

ipcMain.handle('chat-message', async (event, prompt) => {
    history.push({ role: "user", content: prompt });

    try {
        const completion = await client.chat.completions.create({
            model: "moonshot-v1-8k",
            messages: history,
        });

        const reply = completion.choices[0].message.content;
        history.push(completion.choices[0].message);
        return { reply };
    } catch (error) {
        console.error('API调用失败:', error);
        return { error: '调用AI服务失败' };
    }
});

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 956,
        height: 625,
        minHeight: 240,
        minWidth: 360,
        center: true,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),    
            nodeIntegration: true,  // 更安全的设置
            contextIsolation: true,  // 确保启用上下文隔离
        }
    });
    win.loadFile('./index.html');
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('minimize-window', () => {
        win.minimize();
    });

    ipcMain.on('maximize-window', () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    ipcMain.on('close-window', () => {
        win.close();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Videos', extensions: ['mp4', 'ts', 'wav', 'webm'] }
        ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});
