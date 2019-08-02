// Handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')

// squirrel event handled and app will exit in 1000ms, so don't do anything else
if (!setupEvents.handleSquirrelEvent()) {

  // Modules to control application life and create native browser window
  const {app, BrowserWindow, Menu, Tray} = require('electron')
  const settings = require('electron-settings');

  // Check and apply start_on_boot option.
  app.setLoginItemSettings({ openAtLogin: !!settings.get('settings.start_at_boot') });

  // Check for latest used version and clear settings if needed.
  const old_version = settings.get('settings.last_used_version');
  const new_version = require('./package.json').version;
  if (old_version && old_version !== new_version) {
    var compareVersions = require('compare-versions');

    /**
     * Since 1.4.0, ryzenadj is included in the windows package.
     * So we are removing ryzenadj path as it can be included.
     */
    if (compareVersions(old_version, '1.4.0') <= 0) {
      settings.delete('settings.ryzen_adj_path');
    }

    /**
     * Since 1.11.0 we added new settings and apply checkbox,
     * We need to add new settings to presets.
     */
    if (compareVersions(old_version, '1.11.0') <= 0) {
      const update_latest_settings_to_1_11_0 = function(settings) {
        var updated_settings = {};
        for (const setting_name in settings) {
          if (settings.hasOwnProperty(setting_name)) {
            const setting_value = settings[setting_name];
            // Register current setting.
            updated_settings[setting_name] = setting_value;
            // Add apply checkbox to any non-range settings.
            if (setting_name.indexOf('_range') <= 0) {
              if (setting_name.indexOf('apply_') <= 0) {
                updated_settings[`apply_${setting_name}`] = true;
                continue;
              }
            }
          }
        }
        // Adding missing options.
        updated_settings['apply_stapm_time_ms'] = false;
        updated_settings['apply_psi0_current_limit'] = false;
        return updated_settings;
      };
      const update_presets_to_1_11_0 = function(preset_list) {
        var updated_preset_list = {};
        // For each preset.
        for (const preset_name in preset_list) {
          if (preset_list.hasOwnProperty(preset_name)) {
            const preset_settings = preset_list[preset_name];
            updated_preset_list[preset_name] = {};
            // For each setting.
            for (const setting_name in preset_settings) {
              if (preset_settings.hasOwnProperty(setting_name)) {
                const setting_value = preset_settings[setting_name];
                // Register current setting.
                updated_preset_list[preset_name][setting_name] = setting_value;
                if (setting_name.indexOf('_range') <= 0) {
                  continue;
                }
                if (setting_name.indexOf('apply_') <= 0) {
                  // Add apply checkbox.
                  updated_preset_list[preset_name][`apply_${setting_name}`] = true;
                  continue;
                }
              }
            }
            // Adding missing options.
            updated_preset_list[preset_name]['apply_stapm_time_ms'] = false;
            updated_preset_list[preset_name]['apply_psi0_current_limit'] = false;
          }
        }
        return updated_preset_list;
      };
      settings.set('presets', update_presets_to_1_11_0(settings.get('presets')));
      settings.set('latest_controller_tabs_settings', update_latest_settings_to_1_11_0(settings.get('latest_controller_tabs_settings')));
    }

    /**
     * Since 1.12.0, new option to ryzenadj.
     */
    if (compareVersions(old_version, '1.12.0') <= 0) {
      const update_preset_to_1_12_0 = function(settings) {
        // Adding missing options.
        settings['apply_max_gfxclk_frequency'] = false;
        settings['apply_min_gfxclk_frequency'] = false;
        settings['apply_min_socclk_frequency'] = false;
        settings['apply_max_socclk_frequency'] = false;
        return settings;
      };
      const update_presets_to_1_12_0 = function(preset_list) {
        // For each preset.
        for (const preset_name in preset_list) {
          if (preset_list.hasOwnProperty(preset_name)) {
            preset_list[preset_name] = update_preset_to_1_12_0(preset_list[preset_name]);
          }
        }
        return preset_list;
      };
      settings.set('presets', update_presets_to_1_12_0(settings.get('presets')));
      settings.set('latest_controller_tabs_settings', update_preset_to_1_12_0(settings.get('latest_controller_tabs_settings')));
    }

    settings.set('settings',
      Object.assign(
        {},
        settings.set('settings'),
        {
          last_used_version: require('./package.json').version,
          first_launch: true,
        }
      )
    );

  }
  if (!old_version) {
    settings.set('settings',
      Object.assign(
        {},
        settings.set('settings'),
        {
          last_used_version: require('./package.json').version,
          first_launch: true,
        }
      )
    );
  }
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow
  let tray

  function createWindow () {
    let appIcon = '';
    if (require('os').platform() === 'win32') {
      appIcon = __dirname + '/assets/icon.ico';
    } else {
      appIcon = __dirname + '/assets/icon.png';
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
      },
      icon: appIcon,
      show: false,
    })
    if (!settings.get('settings.start_minimized')) {
      mainWindow.show();
      mainWindow.setMenuBarVisibility(false);
    }

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
}
