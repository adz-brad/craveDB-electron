const electron = require('electron');
const url = require('url');
const path = require('path');
const { localStorage } = require('electron-browser-storage');

const { app, BrowserWindow, screen, Menu, ipcMain } = electron;

// Set env
process.env.NODE_ENV = 'development';

//Setup hot reload
if(process.env.NODE_ENV = 'development'){
    try {
        require('electron-reloader')(module)
    } catch (_) {}
}

const craveServer = require('./server/realmServer');

async function getAppID(){
    const appID = await localStorage.getItem('appID');
    return appID;
};

async function getApiKey(){
    const apiKey = await localStorage.getItem('userApiKey');
    return apiKey;
};

async function startServer(){
    const appID = await getAppID();
    const apiKey = await getApiKey();
    craveServer.startServer(apiKey, appID);
};

async function stopServer(){
    craveServer.stopServer();
};

async function restartServer(){
    await stopServer();
    startServer();
}




let mainWindow;
// Listen for app ready
app.on('ready', async function(){

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    // Create new window
    mainWindow = new BrowserWindow({
        width: 400,
        height: height - 50,
        minWidth:400,
        minHeight:height - 50,
        maxWidth:400,
        maxHeight:height - 50,
        frame: false,
        //alwaysOnTop: true,
        fullscreenable: false,
        resizable: false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
        }
    });

    mainWindow.setPosition(width - 400, 25);
    // Load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('close', function (e) {
        mainWindow = null // Clean up your window object. 
     });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

//Catch apiKey:Set
ipcMain.on('ApiKey:Set', function(e, apikey){
    localStorage.setItem('userApiKey', apikey);
});

//Catch appID:Set
ipcMain.on('AppID:Set', function(e, appID){
    localStorage.setItem('appID', appID);
});

//Catch Function:StartServer
ipcMain.on('Function:StartServer', function(e, start){
    if(start === true){
        startServer();
    }
});

//Catch Function:StopServer
ipcMain.on('Function:StopServer', function(e, stop){
    if(stop === true){
        stopServer();
    }
});

//Catch Function:RestartServer
ipcMain.on('Function:RestartServer', function(e, restart){
    if(restart === true){
        restartServer();
    }
});

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            {      
                label: 'Close',
                accelerator: process.platform == 'darwin' ? 'Command+Q ' : 'Ctrl+Q',
                click() {
                    var choice = require('electron').dialog.showMessageBox({
                        type: 'question',
                        buttons: ['Yes', 'No'],
                        title: 'Close craveDB Manager',
                        message: 'Closing craveDB Manager will stop the server. Are you sure you want to quit?'
                    }, (response) => {
                        if (response == '0') {
                            app.quit()
                        }
                    })
                }
            }
        ]
    },
    {
        label:'Server',
        submenu: [
            {
                label: 'Start Server',
                click(){
                    startServer();
                }
            },
            {
                label: 'Stop Server',
                click(){
                    stopServer();
                }
            },
            {
                label: 'Restart Server'
            }
        ]
    },
    {
        label:'Settings',
        submenu: [
            {
                label: 'Server Settings'
            },
            {
                label: 'Preferences'
            }
        ]
    }
];

// Fix menuTempalte on Mac

if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
};

// Add developer tools
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I ' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            },
        ]
    })
}
