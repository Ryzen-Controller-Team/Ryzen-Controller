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
  var exec = require('child_process').exec;
  exec('NET SESSION', function(err,so,se) {
    if (se.length !== 0) {
      notification('warning',
      `Warning: you should launch this app as administrator,`
      + `ryzenadj.exe doesn't seems to work correctly without administrator rights.`
      );
    }
  });
}

/**
 * Will display a notification in ".notification-zone".
 * @param {string} type "primary", "warning", "danger" or "success".
 * @param {string} message The message to be displayed, new line will be replaced by <br/>.
 */
function notification(type, message) {
  appendLog(`notification(): ${type}\n${message}`);
  UIkit.notification({
    message: (''+message).replace(/(?:\r\n|\r|\n)/g, '<br/>'),
    status: type,
    pos: 'top-right',
    timeout: 5000
  });
}

/**
 * Will return the ryzenadj.exe path registered, or default one if not provided.
 */
function getRyzenAdjExecutablePath() {
  const settings = require('electron-settings');
  var ryzen_adj_path = settings.get('settings.ryzen_adj_path');
  if (!ryzen_adj_path) {
    ryzen_adj_path = getCurrentWorkingDirectory() + "\\bin\\ryzenadj.exe";
  }
  appendLog(`getRyzenAdjExecutablePath(): ${ryzen_adj_path}`);
  return ryzen_adj_path;
}

/**
 * Will fill settings page on render with saved data.
 */
function preFillSettings() {
  var ryzen_adj_path = document.getElementById('ryzen_adj_path');
  var fs = require('fs');
  ryzen_adj_path.value = getRyzenAdjExecutablePath();
  if (!fs.existsSync(ryzen_adj_path.value)) {
    notification('danger', "Path to ryzenadj.exe is wrong, please fix it in settings tab.");
  }
  const settings = require('electron-settings');
  document.getElementById('apply_last_settings_on_launch').checked = !!settings.get('settings.apply_last_settings_on_launch');
  document.getElementById('minimize_to_tray').checked = !!settings.get('settings.minimize_to_tray');

  seconds = parseInt(settings.get('settings.reapply_periodically'));
  seconds = seconds >= 0 ? seconds : 0;
  document.getElementById('reapply_periodically').value = seconds;
  document.getElementById('reapply_periodically_range').value = seconds;
}

/**
 * Will open a dialog to let user choose where is ryzenadj.exe.
 */
function askingForRyzenAdjExecutablePath() {
  var remote = require('electron').remote;
  var dialog = remote.require('electron').dialog;

  var path = dialog.showOpenDialog({
    properties: ['openFile']
  }, function (filePaths) {
    if (typeof filePaths[0] !== 'undefined') {
      const settings = require('electron-settings');
      settings.set("settings", {
        ...settings.get('settings'),
        ryzen_adj_path: filePaths[0]
      });
      notification('primary', 'Path to ryzenAdj.exe has been saved.');
      appendLog(`askingForRyzenAdjExecutablePath(): ${filePaths[0]}`);
    } else {
      notification('warning', 'No path given, nothing changed.');
    }
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
  var inputs = document.querySelectorAll('#controller-tab input');
  var latest_controller_tabs_settings = {};
  inputs.forEach(element => {
    let id = element.id;
    let value = element.value;
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
        input.value = value;
      }
    }
  }
  if (settings.get('settings.apply_last_settings_on_launch')) {
    applyRyzenSettings();
  }
}

/**
 * Listen settings tab inputs to save their values.
 */
function registerEventListenerForSettingsInput() {
  const settings = require('electron-settings');

  var apply_last_settings_on_launch = document.getElementById('apply_last_settings_on_launch');
  apply_last_settings_on_launch.addEventListener('change', function() {
    settings.set('settings', {
      ...settings.get('settings'),
      apply_last_settings_on_launch: !!apply_last_settings_on_launch.checked
    });
  });
  var minimize_to_tray = document.getElementById('minimize_to_tray');
  minimize_to_tray.addEventListener('change', function() {
    settings.set('settings', {
      ...settings.get('settings'),
      minimize_to_tray: !!minimize_to_tray.checked
    });
  });
  var reapply_periodically = document.getElementById('reapply_periodically');
  reapply_periodically.addEventListener('change', function() {
    reApplyPeriodically(reapply_periodically.value);
    settings.set('settings', {
      ...settings.get('settings'),
      reapply_periodically: reapply_periodically.value
    });
  });
}

/**
 * Simply display version in appropriate zone.
 */
function displayVersion() {
  const pjson = require('./package.json');
  document.getElementById('version').innerHTML = `v${pjson.version}`;
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
