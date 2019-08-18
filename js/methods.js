/**
 * Will enable Sentry.
 */
function addSentry() {
  const uuidv4 = require('uuid/v4');
  const settings = require('electron-settings');

  var waitSentry = setInterval(() => {
    if (!Sentry) {
      console.log('waitSentry');
      return;
    }
    clearInterval(waitSentry);
    console.log('sentryOk');
    Sentry.init({
      dsn: 'https://f80fd3ea297141a8bdc04ce812762f39@sentry.io/1513427',
      release: require('./package.json').version,
      beforeSend: (event) => {
        event.exception.values = event.exception.values.map((value) => {
          if (value.stacktrace) {
            value.stacktrace.frames = value.stacktrace.frames.map((frame) => {
              frame.filename = frame.filename.replace(/^.*ryzen(|-)controller\//g, "");
              return frame;
            });
          }
          return value;
        });
        if (event.request.url) {
          event.request.url = event.request.url.replace(/^.*ryzen(|-)controller\//g, "");
        }
        return event;
      }
    });
    Sentry.configureScope((scope) => {
      if (!settings.get('userid')) {
        settings.set('userid', uuidv4());
      }
      const userid = settings.get('userid');
      scope.setUser({
        id: userid
      });
    });
  }, 100);
}

/**
 * Will load options_data.json and display them into index.html.
 */
function displayOptions(){
  const options_data = require('./js/options_data.json');
  var tabs = {};
  for (const option_name in options_data) {
    if (!options_data.hasOwnProperty(option_name)) {
      appendLog(`Error while loading ${option_name} option.`);
      continue;
    }
    let option_data = options_data[option_name];
    if (!option_data.hasOwnProperty('tab')) {
      appendLog(`Error while loading ${option_name} tab property.`);
      continue;
    }
    let tab_name = option_data['tab'];
    let tab_name_css = tab_name.toLowerCase().replace(/ /g, "-");
    let tab = document.querySelector(`#${tab_name_css}-tab`);
    if (!tab) {
      let selectorContent = document.querySelector(`#main-container-selector`).innerHTML;
      let tabContent = document.querySelector(`#main-container`).innerHTML;

      document.querySelector('#main-container-selector').innerHTML = /*html*/`
        <li><a href="#">${tab_name}</a></li>
        ${selectorContent}
      `;
      document.querySelector(`#main-container`).innerHTML = /*html*/`
        <li class="uk-margin-top uk-margin-bottom uk-container" id="${tab_name_css}-tab"></li>
        ${tabContent}
      `;
      tab = document.querySelector(`#${tab_name_css}-tab`);
    }
    tabs[tab_name_css] = true;
    tab.innerHTML += /*html*/`
      <h3 id="${option_name}-label" uk-tooltip="${option_data.description}"><label>
        <input class="uk-checkbox uk-margin-small-right" type="checkbox" id="apply_${option_name}"/>
        <span class="option-label">${option_data.label}</span>
      </label></h3>
      <div class="uk-grid-small" uk-grid>
        <div class="uk-width-1-6">
          <input
            class="uk-input"
            type="number"
            id="${option_name}"
            repeat="${option_name}_range"
            min="${option_data.min}"
            max="${option_data.max}"
            step="${option_data.step}"
            value="${option_data.default}"
          />
        </div>
        <div class="uk-width-expand">
          <input
            class="uk-range"
            type="range"
            repeat="${option_name}"
            id="${option_name}_range"
            min="${option_data.min}"
            max="${option_data.max}"
            step="${option_data.step}"
            value="${option_data.default}"
          />
        </div>
      </div>
    `;
    UIkit.tooltip(document.querySelector(`#${option_name}-label`));
  }

  for (const tab_name_css in tabs) {
    if (tabs.hasOwnProperty(tab_name_css)) {
      const tab = document.querySelector(`#${tab_name_css}-tab`);
      tab.innerHTML += /*html*/`
        <p class="uk-margin">
          <button class="uk-button uk-button-primary" onClick="applyRyzenSettings()">Apply</button>
          <button class="uk-button uk-button-secondary" uk-toggle="target: #modal-new-preset">Save to preset</button>
        </p>
      `;
    }
  }
}

/**
 * Will create a nodes from an html string.
 * @param {string} str An html string
 */
function parseHTML(str) {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children;
};

/**
 * Return the current working directory.
 */
function getCurrentWorkingDirectory() {
  const cwd = require('electron').remote.app.getAppPath()
  appendLog(`getCurrentWorkingDirectory(): ${cwd}`);
  return cwd;
}

/**
 * Conversion from int to hex.
 * @param {int} number A number.
 */
function decimalToHexString(number) {
  if (number < 0)
  {
    number = 0xFFFFFFFF + number + 1;
  }

  return number.toString(16).toUpperCase();
}

/**
 * Will execute the given callback once document is ready.
 * @param {function} fn A callback to be executed.
 */
function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/**
 * Will make sure inputs are repeated when needed.
 *
 * Use the "repeat" html attribute to define where the current value must be repeated.
 */
function registerRepeaterForAllInput() {
  var ranges = document.querySelectorAll('[repeat]');
  for (const range in ranges) {
    if (ranges.hasOwnProperty(range)) {
      const element = ranges[range];
      element.addEventListener('change', function(event) {
        var repeater = document.getElementById(event.target.attributes.repeat.value);
        repeater.value = event.target.value;
      });
    }
  }
}

/**
 * Check that the app is running with admin right.
 *
 * Will display a warning if not.
 */
function checkForAdminRights() {
  if (!isWindows()) {
    const isRoot = process.getuid && process.getuid() === 0;
    if (!isRoot) {
      notification('danger',
      `Warning: you must launch this app as administrator.<br/>`
      + `Use "sudo ryzencontroller" from terminal to fix this.`
      );
    }
  } else {
    const child = require('child_process').execFile;
    child('NET SESSION', function(err,so,se) {
      if (se.length !== 0) {
        notification('warning',
          `Warning: you should launch this app as administrator, `
        + `ryzenadj.exe doesn't seems to work correctly without administrator rights.`
        );
      }
    });
  }
}

/**
 * Check that the app is running on Windows.
 */
function isWindows() {
  return require('os').platform() === 'win32';
}

/**
 * Will display a notification in ".notification-zone".
 * @param {string} type "primary", "warning", "danger" or "success".
 * @param {string} message The message to be displayed, new line will be replaced by <br/>.
 */
function notification(type, message) {
  appendLog(`notification(): ${type}\n${message}`);

  if (window.last_notification) {
    window.last_notification.close();
    window.last_notification = false;
  }
  window.last_notification = new Notification('Ryzen Controller', {
    body: message,
    requireInteraction: false,
    silent: true,
  });

  if (!window.last_notification) {
    window.last_notification = false;
    UIkit.notification({
      message: (''+message).replace(/(?:\r\n|\r|\n)/g, '<br/>'),
      status: type,
      pos: 'top-right',
      timeout: 5000,
    });
  }
}

/**
 * Will return the ryzenadj.exe path registered, or default one if not provided.
 */
function getRyzenAdjExecutablePath() {
  const settings = require('electron-settings');
  var ryzen_adj_path = settings.get('settings.ryzen_adj_path');
  if (!ryzen_adj_path && isWindows()) {
    ryzen_adj_path = getCurrentWorkingDirectory() + "\\bin\\ryzenadj.exe";
  }
  appendLog(`getRyzenAdjExecutablePath(): "${ryzen_adj_path}"`);
  return ryzen_adj_path;
}

/**
 * Will fill settings page on render with saved data.
 */
function preFillSettings() {
  const ryzen_adj_path = document.getElementById('ryzen_adj_path');
  const settings = require('electron-settings');

  ryzen_adj_path.value = getRyzenAdjExecutablePath();
  document.getElementById('start_at_boot').checked = !!settings.get('settings.start_at_boot');
  document.getElementById('apply_last_settings_on_launch').checked = !!settings.get('settings.apply_last_settings_on_launch');
  document.getElementById('minimize_to_tray').checked = !!settings.get('settings.minimize_to_tray');
  document.getElementById('start_minimized').checked = !!settings.get('settings.start_minimized');

  seconds = parseInt(settings.get('settings.reapply_periodically'));
  seconds = seconds >= 0 ? seconds : 0;
  document.getElementById('reapply_periodically').value = seconds;
  document.getElementById('reapply_periodically_range').value = seconds;
}

/**
 * Check if ryzenadj executable has been registered and is valid.
 * Will display a notification if not.
 *
 * @return {Boolean} True if ryzenadj executable exists.
 */
function isRyzenAdjPathValid() {
  var fs = require('fs');

  if (!fs.existsSync(getRyzenAdjExecutablePath())) {
    notification('danger', "Path to ryzenadj.exe is wrong, please fix it in settings tab.");
    return false;
  }
  return true;
}

/**
 * Will open a dialog to let user choose where is ryzenadj.exe.
 */
function askingForRyzenAdjExecutablePath() {
  var remote = require('electron').remote;
  var dialog = remote.require('electron').dialog;

  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (filePaths) {
    const settings = require('electron-settings');
    if (typeof filePaths === 'undefined') {
      notification('warning', 'No path given, nothing changed.');
      return;
    }
    if (typeof filePaths[0] === 'undefined') {
      notification('warning', 'No path given, nothing changed.');
      return;
    }

    settings.set("settings",
      Object.assign(
        {},
        settings.get('settings'),
        { ryzen_adj_path: filePaths[0] }
      )
    );

    notification('primary', 'Path to ryzenAdj executable has been saved.');
    appendLog(`askingForRyzenAdjExecutablePath(): ${filePaths[0]}`);
    preFillSettings();
  });
}

/**
 * Will append logs to the logs tab.
 * @param {string} message The message to be logged.
 */
function appendLog(message) {
  var log_area = document.getElementById('logs');
  log_area.value += message + "\n";
  console.log(message);
}

/**
 * Will save the latest used settings.
 */
function saveLatestUsedSettings() {
  var inputs = document.querySelectorAll('#main-container *[id$="-tab"] input');
  var latest_controller_tabs_settings = {};
  inputs.forEach(element => {
    let id = element.id;
    let value = element.value;
    if (id.indexOf('apply_') === 0) {
      value = element.checked;
    }
    latest_controller_tabs_settings[id] = value;
  });
  const settings = require('electron-settings');
  let ret = settings.set("latest_controller_tabs_settings", latest_controller_tabs_settings);
  appendLog(`saveLatestUsedSettings(): ${JSON.stringify(latest_controller_tabs_settings)}`);
  appendLog(`saveLatestUsedSettings(): ${JSON.stringify(ret)}`);
}

/**
 * Will load the latest settings and refresh the controller tab's values.
 *
 * Will also apply latest settings if settings.apply_last_settings_on_launch is true.
 */
function loadLatestUsedSettings() {
  const settings = require('electron-settings');
  var latest_controller_tabs_settings = settings.get("latest_controller_tabs_settings");
  appendLog(`loadLatestUsedSettings(): ${JSON.stringify(latest_controller_tabs_settings)}`);
  for (const id in latest_controller_tabs_settings) {
    if (latest_controller_tabs_settings.hasOwnProperty(id)) {
      const value = latest_controller_tabs_settings[id];
      let input = document.getElementById(id);
      if (input) {
        if (id.indexOf('apply_') === 0) {
          input.checked = value;
        } else {
        input.value = value;
      }
    }
  }
  }
  if (document.isStarting && settings.get('settings.apply_last_settings_on_launch')) {
    applyRyzenSettings();
  }
}

/**
 * Will show or display options based on apply checkboxes value.
 */
function toggleOptionDisplayBasedOnApplyCheckbox() {
  var checkbox_toggle_options = document.querySelectorAll('#main-container *[id$="-tab"] input[id^=apply_]');
  const hideOptionBasedOnInput = function (input) {
    if (input.checked) {
      input.parentElement.parentElement.nextElementSibling.removeAttribute('hidden');
    } else {
      input.parentElement.parentElement.nextElementSibling.setAttribute('hidden', '');
    }
  }
  Array.from(checkbox_toggle_options).forEach(input => {
    hideOptionBasedOnInput(input);
    input.addEventListener('change', function(event) {
      hideOptionBasedOnInput(input);
    });
  });
}

/**
 * Listen settings tab inputs to save their values.
 */
function registerEventListenerForSettingsInput() {
  const settings = require('electron-settings');

  toggleOptionDisplayBasedOnApplyCheckbox();

  var apply_last_settings_on_launch = document.getElementById('apply_last_settings_on_launch');
  apply_last_settings_on_launch.addEventListener('change', function() {

    settings.set(
      "settings",
      Object.assign(
        {},
        settings.get('settings'),
        { apply_last_settings_on_launch: !!apply_last_settings_on_launch.checked }
      )
    );

  });
  var minimize_to_tray = document.getElementById('minimize_to_tray');
  minimize_to_tray.addEventListener('change', function() {

    settings.set(
      "settings",
      Object.assign(
        {},
        settings.get('settings'),
        { minimize_to_tray: !!minimize_to_tray.checked }
      )
    );

  });
  var start_minimized = document.getElementById('start_minimized');
  start_minimized.addEventListener('change', function() {

    settings.set(
      "settings",
      Object.assign(
        {},
        settings.get('settings'),
        { start_minimized: !!start_minimized.checked }
      )
    );

  });
  var reapply_periodically = document.getElementById('reapply_periodically');
  reapply_periodically.addEventListener('change', function() {
    reApplyPeriodically(reapply_periodically.value);

    settings.set(
      "settings",
      Object.assign(
        {},
        settings.get('settings'),
        { reapply_periodically: reapply_periodically.value }
      )
    );

  });
  var start_at_boot = document.getElementById('start_at_boot');
  start_at_boot.addEventListener('change', function() {

    settings.set(
      "settings",
      Object.assign(
        {},
        settings.get('settings'),
        { start_at_boot: !!start_at_boot.checked }
      )
    );

    updateScheduledStartOnBoot(!!start_at_boot.checked);
  });
}

/**
 * Simply display version in appropriate zone.
 */
function displayVersion() {
  const pjson = require('./package.json');
  document.getElementById('version').innerHTML = `v${pjson.version}${isDevMode() ? '-dev' : ''}`;
}

/**
 * Re-apply flow for "reapply_periodically" settings.
 * @param {number} seconds Interval in seconds between each apply.
 */
function reApplyPeriodically(seconds) {
  seconds = parseInt(seconds) >= 0 ? parseInt(seconds) : 0;
  appendLog(`reApplyPeriodically(): seconds = ${seconds}`);
  appendLog(`reApplyPeriodically(): document.reapplyLoop = ${document.reapplyLoop}`);
  clearInterval(document.reapplyLoop);
  document.reapplyLoop = false;

  if (seconds <= 0) {
    if (!document.isStarting) {
      notification('primary', "Ryzen Controller no more will re-apply ryzenadj periodically.");
    }
    return;
  }

  document.reapplyLoop = setInterval(applyRyzenSettings, seconds * 1000);
}

/**
 * Will recreate shortcut on launch ... no other solution for now :(
 */
function recreateShortcut() {
  const settings = require('electron-settings');

  if (!!settings.get('settings.first_launch')) {
    let app = require('electron').remote.app;
    let fs = require('fs');
    try {
      var shortcut_path = app.getPath('desktop') + "\\Ryzen Controller";
      fs.unlink(shortcut_path, console.log);
      fs.symlink(app.getPath('exe'), shortcut_path, function (err) {
        if (err) {
          notification("danger", "Shortcut can't be created, please check log tabs for more info.");
          appendLog(`recreateShortcut(): ${err}`);
        }
        else {
          notification('primary', "A shortcut has been created on desktop.");
        }
      });
    } catch (error) {
      appendLog(`recreateShortcut() ${error}`);
      Sentry.captureException(`recreateShortcut() ${error}`);
    }
  }
}

/**
 * Will return an object completed with the current settings from inputs.
 * @param {string} keyType "inputId" or "ryzenadjArgs"
 */
function getCurrentSettings(keyType) {
  if (keyType === "ryzenadjArgs") {

    const options_data = require('./js/options_data.json');
    var settingsToBeUsed = {};
    for (const elementId in options_data) {
      if (options_data.hasOwnProperty(elementId)) {
        const optionData = options_data[elementId];
        const ryzenadjArg = optionData.ryzenadj_arg;
        if (document.getElementById('apply_' + elementId).checked) {
          settingsToBeUsed[ryzenadjArg] = document.getElementById(elementId).value;
        }
      }
    }

    appendLog('getCurrentSettings(): ' + JSON.stringify(settingsToBeUsed));
    return settingsToBeUsed;

  } else {
    var inputs = document.querySelectorAll('#main-container *[id$="-tab"] input');
    var currentSettings = {};
    inputs.forEach(element => {
      let id = element.id;
      let value = element.value;
      if (id.indexOf('apply_') === 0) {
        value = element.checked;
      }
      currentSettings[id] = value;
    });
    return currentSettings;
  }
}

/**
 * Will check for new release.
 */
function checkForNewRelease() {
  var request = new XMLHttpRequest();
  const version = require('./package.json').version;

  try {
    request.open('GET', 'https://gitlab.com/api/v4/projects/11046417/releases', true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var resp = {};
        try {
          resp = JSON.parse(this.response);
        } catch (error) {
          console.log('WARNING: unable to check if a new version is available.', error);
          return;
        }
        if (resp[0].tag_name !== version) {
          notification('primary', "A new vesion is available, please check the release tab.");
        }
      }
    };

    request.send();
  } catch (error) {
    console.log('Unable to check if new release is available.', error);
  }
}

/**
 * Will change the BCD entry value for userplatformclock.
 *
 * @param {string} value BCD entry value for userplatformclock: "true" or "false".
 */
function toggleHpet(value) {
  value = value === "true" ? "true" : "false";
  const BcdeditExecutablePath = "C:\\Windows\\System32\\bcdedit.exe";
  const parameters = [
    "/set",
    "useplatformclock",
    value,
  ];

  const child = require('child_process').execFile;
  child(BcdeditExecutablePath, parameters, function(err, data) {
    var output = data.toString();
    if (err) {
      notification('danger', err + '<br/>' + output);
    }
    else if (output) {
      notification('success', 'Bcdedit output:<br/>' + output);
      saveLatestUsedSettings();
    }
  });
}

/**
 * Any element containing class "windows-only" will be hidden on other platform.
 */
function handlePlatformSpecificDisplay() {
  var windows_only_elements = document.getElementsByClassName('windows-only');
  if (!isWindows()) {
    for (const item of windows_only_elements) {
      item.setAttribute('hidden', 'true');
    }
  }
}

/**
 * Will delete scheduled task to start ryzen controller on session start then recreate it if isEnable is true.
 *
 * @param {bool} toBeEnabled Is auto launch should be enabled?
 */
function updateScheduledStartOnBoot(toBeEnabled) {
  const app = require('electron').remote.app;
  window.app = app;
  const AutoLaunch = require('auto-launch');
  let autoLaunch = new AutoLaunch({
    name: 'Ryzen Controller'
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    console.log(`toBeEnabled: ${toBeEnabled} isEnabled: ${isEnabled}`);

    try {
      if (isEnabled) {
        autoLaunch.disable();
      }
      if (toBeEnabled) {
        autoLaunch.enable();
      }
    } catch (error) {
      console.log("WARNING: Unable to manage start on boot.", error);
    }
  });
}

/**
 * Return true if dev mode.
 */
function isDevMode() {
  return !require('electron').remote.app.isPackaged;
}

/**
 * Will listen for system events and handle status for it.
 */
function handleAcStatusChanges() {
  const powerMonitor = require('electron').remote.powerMonitor;
  const settings = require('electron-settings');

  let applyPresetOnAcStatusChange = function(presetName) {
    appendLog(`applyPresetOnAcStatusChange(${presetName})`);
    if (!presetName) {
      return;
    }
    preset_apply(presetName);
  };

  powerMonitor.on('on-ac', () => {
    applyPresetOnAcStatusChange(settings.get(`auto-apply.update-ac-plugged-in`));
  });
  powerMonitor.on('on-battery', () => {
    applyPresetOnAcStatusChange(settings.get(`auto-apply.update-ac-plugged-out`));
  });
}
