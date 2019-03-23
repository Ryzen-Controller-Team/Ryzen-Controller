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
  if (require('os').platform() !== 'win32') {
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
  if (!ryzen_adj_path && require('os').platform() === 'win32') {
    ryzen_adj_path = getCurrentWorkingDirectory() + "\\bin\\ryzenadj.exe";
  }
  appendLog(`getRyzenAdjExecutablePath(): "${ryzen_adj_path}"`);
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
  // document.getElementById('start_at_boot').checked = !!settings.get('settings.start_at_boot');
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
  var inputs = document.querySelectorAll('#controller-tab input, #experimental-tab input');
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
  var checkbox_toggle_options = document.querySelectorAll('#controller-tab input[id^=apply_], #experimental-tab input[id^=apply_]');
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
  // var start_at_boot = document.getElementById('start_at_boot');
  // start_at_boot.addEventListener('change', function() {
  //   settings.set('settings', {
  //     ...settings.get('settings'),
  //     start_at_boot: !!start_at_boot.checked
  //   });
  //   require('electron').remote.app.setLoginItemSettings({ openAtLogin: !!start_at_boot.checked });
  // });
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

/**
 * Display tooltip on each options.
 */
function displayOptionDescription() {
  const options_description = require('./js/options_description.json');
  for (const option in options_description) {
    if (options_description.hasOwnProperty(option)) {
      const description = options_description[option];
      const node = document.getElementById(option).parentElement.parentElement;
      node.setAttribute('uk-tooltip', description);
      UIkit.tooltip(node);
    }
  }
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
    }
  }
}

/**
 * Will return an object completed with the current settings from inputs.
 * @param {string} keyType "inputId" or "ryzenadjArgs"
 */
function getCurrentSettings(keyType) {
  if (keyType === "ryzenadjArgs") {
    const optionToId = {
      "--stapm-time=": 'stapm_time_ms',
      "--stapm-limit=": 'stapm_limit_w',
      "--fast-limit=": 'ppt_fast_limit_w',
      "--slow-limit=": 'ppt_slow_limit_w',
      "--tctl-temp=": 'temperature_limit_c',
      "--vrmmax-current=": 'vrm_current_m_a',
      "--min-fclk-frequency=": 'min_fclk_frequency',
      "--max-fclk-frequency=": 'max_fclk_frequency',
    };

    var settingsToBeUsed = {};
    for (const option in optionToId) {
      if (optionToId.hasOwnProperty(option)) {
        const elementId = optionToId[option];
        if (document.getElementById('apply_' + elementId).checked) {
          settingsToBeUsed[option] = document.getElementById(elementId).value;
        }
      }
    }

    appendLog('getCurrentSettings(): ' + JSON.stringify(settingsToBeUsed));
    return settingsToBeUsed;

  } else {
    var inputs = document.querySelectorAll('#controller-tab input, #experimental-tab input');
    var currentSettings = {};
    inputs.forEach(element => {
      let id = element.id;
      let value = element.value;
      currentSettings[id] = value;
    });
    return currentSettings;
  }
}

/**
 * Will save the current settings to a new preset.
 */
function saveToNewPreset() {
  const settingsToBeSaved = getCurrentSettings("inputId");
  const currentPresets = require('electron-settings').get('presets') || {};
  var newPresetName = document.getElementById('new_preset_name').value;

  if (!newPresetName) {
    notification('danger', 'You must provide a preset name.');
    return;
  }

  if (typeof currentPresets[newPresetName] !== "undefined") {
    newPresetName = findUnusedNewPresetName(newPresetName);
    notification('warning', `This preset name already exist, your preset has been saved with the name "${newPresetName}".`);
  }

  const newPresetList = {
    ...currentPresets,
    [newPresetName]: settingsToBeSaved,
  };
  require('electron-settings').set('presets', newPresetList);
  appendLog(`saveToNewPreset(): Saved preset ${newPresetName}, ${JSON.stringify(newPresetList)}`);
  updatePresetList();
  if (newPresetName === document.getElementById('new_preset_name').value) {
    notification('success', `The preset ${newPresetName} has been saved.`);
  }
}

/**
 * This recursive function will return an available preset name to be used to save a preset.
 *
 * @param {string} newPresetName The preset name to be edited.
 * @param {number} suffix The preset name suffix
 */
function findUnusedNewPresetName(newPresetName, suffix = 1) {
  const currentPresets = require('electron-settings').get('presets') || {};
  if (typeof currentPresets[`${newPresetName}${suffix}`] !== "undefined") {
    suffix++;
    return findUnusedNewPresetName(newPresetName, suffix);
  }
  return `${newPresetName}${suffix}`;
}

/**
 * This will update the preset tab based on saved presets.
 */
function updatePresetList() {
  var presetTab = document.getElementById('presetTab');
  const currentPresets = require('electron-settings').get('presets') || {};

  var content = '';
  content += '<ul class="uk-list">';

  if (Object.keys(currentPresets).length === 0) {
    content += `<li>No preset has been created yet, use "Save to preset" button on Controller tab to create one.</li>`;
  }

  for (const presetName in currentPresets) {
    if (currentPresets.hasOwnProperty(presetName)) {
      const preset = currentPresets[presetName];

      let valueSummary = [];
      for (const key in preset) {
        if (preset.hasOwnProperty(key) && key.indexOf('_range') !== -1 && key.indexOf('apply_') != 0) {
          const value = preset[key];
          valueSummary.push(value);
        }
      }
      valueSummary.join(', ');

      content += `
        <li class="uk-margin">
          <span class="uk-text-lead">${presetName}</span>
          <i class="uk-text-small">${valueSummary}</i>
          <button class="uk-button uk-button-danger uk-align-right" type="button" onClick="presetDeletion('${presetName}')">
            Delete
          </button>
          <button class="uk-button uk-button-primary uk-align-right" type="button" onClick="applyPreset('${presetName}')">
            Apply
          </button>
        </li>
      `;
    }
  }
  content += '</ul>';
  presetTab.innerHTML = content;
}

/**
 * This will apply the preset you asked for.
 * @param {string} presetName The preset name to be applied.
 */
function applyPreset(presetName) {
  const presets = require('electron-settings').get(`presets.${presetName}`);
  appendLog(`applyPreset(): preset ${presetName}: ${JSON.stringify(presets)}`);
  var ret = require('electron-settings').set("latest_controller_tabs_settings", presets);
  appendLog(`applyPreset(): saved preset: ${JSON.stringify(ret)}`);
  loadLatestUsedSettings();
  applyRyzenSettings();
  toggleOptionDisplayBasedOnApplyCheckbox();
}

/**
 * This will delete the preset you asked for.
 * @param {string} presetName The preset name to be deleted.
 */
function presetDeletion(presetName) {
  var presets = require('electron-settings').get(`presets`);
  delete presets[presetName];
  require('electron-settings').set(`presets`, presets);
  notification('success', `The preset ${presetName} has been deleted.`);
  updatePresetList();
}

/**
 * Will check for new release.
 */
function checkForNewRelease() {
  var request = new XMLHttpRequest();
  const version = require('./package.json').version;

  request.open('GET', 'https://gitlab.com/api/v4/projects/11046417/releases', true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var resp = JSON.parse(this.response);
      if (resp[0].tag_name !== version) {
        notification('primary', "A new vesion is available, please check the release tab.");
      }
    }
  };

  request.send();
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

function handlePlatformSpecificDisplay() {
  var windows_only_elements = document.getElementsByClassName('windows-only');
  if (require('os').platform() !== 'win32') {
    for (const item of windows_only_elements) {
      item.setAttribute('hidden', 'true');
    }
  }
}
