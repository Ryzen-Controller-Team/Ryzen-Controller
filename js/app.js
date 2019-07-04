ready(function(){
  const settings = require('electron-settings');
  const fixPath = require('fix-path');
  document.isStarting = true;
  fixPath();
  displayOptions();
  preFillSettings();
  loadLatestUsedSettings();
  registerRepeaterForAllInput();
  registerEventListenerForSettingsInput();
  checkForAdminRights();
  displayVersion();
  reApplyPeriodically(require('electron-settings').get('settings.reapply_periodically'));
  if (require('os').platform() === 'win32') {
    recreateShortcut();
  }
  handlePlatformSpecificDisplay();
  preset_updateList();
  checkForNewRelease();
  document.isStarting = false;


  settings.set('settings',
    Object.assign(
      {},
      settings.get('settings'),
      { first_launch: false }
    )
  );
});

/**
 * Will create and handle ryzenadj.exe execution.
 */
function applyRyzenSettings() {
  const settings = getCurrentSettings("ryzenadjArgs");
  const appSettings = require('electron-settings');

  const child = require('child_process').execFile;
  const executablePath = getRyzenAdjExecutablePath();

  const options_data = require('./js/options_data.json');
  const ryzenAdjConvert = {
    "toHex": function (value) { return '0x' + decimalToHexString(value * 1000); },
    "toThousand": function (value) { return value * 1000; },
    "roundTen": function (value) { return parseInt(value / 10) * 10; },
  };

  // Create a string to be used for CLI.
  var parameters = [];
  for (const option in settings) {
    if (settings.hasOwnProperty(option)) {
      let value = settings[option];
      let option_name = false;
      try {
        option_name = Object.keys(options_data).filter(function(cur_option_name){
          return options_data[cur_option_name].ryzenadj_arg === option;
        })[0];
      } catch (error) {
        notification('danger', `Unknown option "${option}".`);
        appendLog(`applyRyzenSettings(): ${error}`);
      }
      if (options_data[option_name].ryzenadj_value_convert) {
        value = ryzenAdjConvert[
          options_data[option_name].ryzenadj_value_convert
        ](value);
      }
      parameters.push('' + option + value);
    }
  }

  if (!appSettings.get('retry')) {
    appSettings.set('retry', 2);
    notification('warning', 'Applying settings...');
  } else {
    let retry = appSettings.get('retry') - 1;
    appSettings.set('retry', retry);
  }
  child(executablePath, parameters, function(err, data) {
    var output = data.toString();
    if (err) {
      if (appSettings.get('retry')) {
        return setTimeout(applyRyzenSettings, 500);
      }
      notification('danger', err + '<br/>' + output);
    }
    else if (output) {
      notification('success', 'Ryzenadj output:<br/>' + output);
      saveLatestUsedSettings();
    }
    appSettings.set('retry', false);
  });

}
