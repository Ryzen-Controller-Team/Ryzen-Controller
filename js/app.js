ready(function(){
  const settings = require('electron-settings');
  document.isStarting = true;
  registerRepeaterForAllInput();
  registerEventListenerForSettingsInput();
  checkForAdminRights();
  preFillSettings();
  loadLatestUsedSettings();
  displayVersion();
  reApplyPeriodically(require('electron-settings').get('settings.reapply_periodically'));
  displayOptionDescription();
  recreateShortcut();
  updatePresetList();
  checkForNewRelease();
  document.isStarting = false;
  settings.set('settings', {
    ...settings.get('settings'),
    first_launch: false
  });
});

/**
 * Will create and handle ryzenadj.exe execution.
 */
function applyRyzenSettings() {
  const settings = getCurrentSettings("ryzenadjArgs");

  const child = require('child_process').execFile;
  const executablePath = getRyzenAdjExecutablePath();

  var parameters = [];
  for (const option in settings) {
    if (settings.hasOwnProperty(option)) {
      let value = settings[option];

      switch (option) {
        case "--stapm-limit=":
        case "--fast-limit=":
        case "--slow-limit=":
          value = value * 1000;
          break;

        case "--tctl-temp=":
        case "--max-fclk-frequency=":
        case "--min-fclk-frequency=":
          value = value;
          break;

        case "--vrmmax-current=":
          value = '0x' + decimalToHexString(value * 1000);
          break;
      
        default:
          break;
      }

      parameters.push('' + option + value);
    }
  }

  child(executablePath, parameters, function(err, data) {
    var output = data.toString();
    if (err) {
      notification('danger', err + '<br/>' + output);
    }
    else if (output) {
      notification('success', 'Ryzenadj output:<br/>' + output);
      saveLatestUsedSettings();
    }
  });

}
