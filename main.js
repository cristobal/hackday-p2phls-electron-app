//--------------------------------------
//  Setup Electron App
//--------------------------------------

const electron = require('electron')

// Module to control application life
const {app} = electron

// Module to create native browser window
const {BrowserWindow} = electron

// Modules
const path = require('path')
const url  = require('url')

// App Title
const title = 'P2P HLS - Player Poc'
const backgroundColor = '#262626';

// Log info
console.log(`${title}`)
console.log(`--- Node ${process.versions.node},`)
console.log(`--- Chromium ${process.versions.chrome},`)
console.log(`--- Electron ${process.versions.electron}`)
console.log('')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, title, backgroundColor})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})



//--------------------------------------
//  Setup application logic
//--------------------------------------
const seedServer = require('./src/app/seed-server')
const {ipcMain}  = electron

ipcMain.on('seed-key', (event, key) => {
  seedServer.createServer(key)
    .then(({server, port, src}) => {
      event.sender.send('seed-src', src)
    })
})
