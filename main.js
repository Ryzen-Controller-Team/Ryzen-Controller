// Handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  mainWindow.setOpacity(0.95);
  
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  
  const settings = require('electron-settings');
  mainWindow.on('minimize',function(event){
    if (settings.get('settings.minimize_to_tray')) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: function () {
        application.isQuiting = true;
        application.quit();
      }
    }
  ]);

  tray = new Tray(__dirname + '/assets/icon.ico');
  tray.setContextMenu(contextMenu);
  tray.setIgnoreDoubleClickEvents(true);
  tray.on('click', function() {
    mainWindow.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
