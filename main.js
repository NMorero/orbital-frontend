const { app, BrowserWindow, ipcMain, ipcRenderer, remote } = require('electron')
const path = require('path')
const Client = require('ftp');
const os = require('os')
const fs = require('fs');
const axios = require('axios');

const DATA_PATH = 'C:/Users/'+os.userInfo().username+'/AppData/Local/Programs/orbitaloffline/DATA';
const JSON_PATH = DATA_PATH+'/json';
const IMAGES_PATH = DATA_PATH+'/images';
const ORBS_PATH = DATA_PATH+'/orbs';
const API_URL = 'http://localhost:3000';

ipcMain.on('test',async (event, arg) => {
  if (!fs.existsSync(DATA_PATH)){
    fs.mkdirSync((DATA_PATH));
    fs.mkdirSync(JSON_PATH, { recursive: true });
    fs.mkdirSync(IMAGES_PATH, { recursive: true });
    fs.mkdirSync(ORBS_PATH, { recursive: true });

    axios({
      method: 'get',
      url: API_URL+'/getOrbs',
      responseType: 'stream'
    })
      .then(function (response) {
        console.log(response.data.data)
      });

  }else{
    axios({
      method: 'get',
      url: API_URL+'/getOrbs',
    })
    .then(function (response) {
      console.log(response.data.data[0].id == test.id)
    });
  }
})

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});
const createWindow = () => {
    const win = new BrowserWindow({
      width: 500,
      height: 300,
      minHeight: 300,
      minWidth: 500,
      frame: true,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      }
    })
    
    //win.setMenu(null)
    win.loadFile('pages/splash.html')
    
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


function downloadFile(ftpPath, endPath){
  var c = new Client();
  c.on('ready', function() {
      c.get(ftpPath, function(err, stream) {
        if (err) throw err;
        stream.once('close', function() { c.end(); });
        stream.pipe(fs.createWriteStream('C:/Users/'+os.userInfo().username+'/AppData/Local/Programs/orbitaloffline/DATA/'+endPath));
      });
    });
  // connect to localhost:21 as anonymous
  c.connect({
    host: "ftpcloud.cluster024.hosting.ovh.net",
    user: "offconl-archelierit_ovh-42760",
    password: "24deOctubre"
  });
}
