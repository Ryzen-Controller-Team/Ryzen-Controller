const Splashscreen = require("@trodi/electron-splashscreen");

const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const electronSettings = require('electron-settings');

const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const app_version_as_string = app.getVersion().replace(/\./g, '_') + (isDev ? '-dev' : '');

let mainWindow;
let tray;

const currentSettings = () => {
  const localStorage = electronSettings.get(app_version_as_string);
  if (localStorage) {
    return localStorage.settings;
  }
  return false;
};

const createWindow = () => {
  let appIcon = '';
  if (require('os').platform() === 'win32') {
    appIcon = __dirname + '/icon.ico';
  } else {
    appIcon = __dirname + '/icon.png';
  }

  const mainWindowOpt = {
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
    },
    icon: appIcon,
    show: false,
    transparent: true,
  };

  const splashTimeOut = 2500;
  mainWindow = Splashscreen.initSplashScreen({
    windowOpts: mainWindowOpt,
    templateUrl: path.join(__dirname, "..", isDev ? "public" : "build", "splash.html"),
    delay: 0,
    minVisible: splashTimeOut,
    splashScreenOpts: {
      height: 900,
      width: 900,
      transparent: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  let showOnStart = true;
  if (currentSettings()) {
    if (currentSettings().minimizeOnLaunch === true) {
      showOnStart = false;
    }
  }

  if (showOnStart) {
    setTimeout(()=>{
      mainWindow.show();
    }, splashTimeOut);
  }

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
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray = new Tray(appIcon);
  tray.setContextMenu(contextMenu);
  tray.setIgnoreDoubleClickEvents(true);
  tray.on('click', function() {
    mainWindow.show();
  });

  mainWindow.on('minimize',function(event){
    if (currentSettings()) {
      if (currentSettings().minimizeToTray) {
        event.preventDefault();
        // Weird behavior on linux where the "minimize" event is triggered when re-opening the app from tray icon.
        setTimeout(()=>{
          mainWindow.show();
          mainWindow.hide();
        }, 100);
      }
    }
  });

  mainWindow.on('closed', () => mainWindow = null);
  app.getWindow = function() {
    return mainWindow;
  }
}

let isPrimaryInstance = app.requestSingleInstanceLock()
if (!isPrimaryInstance) {
  app.quit();
}

app.on('second-instance', ()=>{
  mainWindow.show();
  mainWindow.focus();
});

app.on('ready', () => setTimeout(createWindow, 400));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
