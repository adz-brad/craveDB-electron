const electron = require('electron');

const { ipcRenderer } = electron;

const apiInput = document.querySelector('#apiInputForm');
apiInput.addEventListener('submit', saveApiKey);

function saveApiKey(e){
    e.preventDefault();
    const apikey = document.querySelector('#apiKeyInput').value;
    ipcRenderer.send('ApiKey:Set', apikey);
};

const appIDInput = document.querySelector('#appIDInputForm');
appIDInput.addEventListener('submit', saveAppID);

function saveAppID(e){
    e.preventDefault();
    const appID = document.querySelector('#appIDInput').value;
    ipcRenderer.send('AppID:Set', appID);
};
    
function startServer(){
    const start = true;
    ipcRenderer.send('Function:StartServer', start);
};

function stopServer(){
    const stop = true;
    ipcRenderer.send('Function:StopServer', stop);
};

function restartServer(){
    const restart = true;
    ipcRenderer.send('Function:RestartServer', restart);
};