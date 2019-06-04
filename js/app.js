ready(function(){
  const settings = require('electron-settings');
  const fixPath = require('fix-path');
  document.isStarting = true;
  fixPath();
  preFillSettings();
  loadLatestUsedSettings();
  registerRepeaterForAllInput();
  registerEventListenerForSettingsInput();
  checkForAdminRights();
  displayVersion();
  reApplyPeriodically(require('electron-settings').get('settings.reapply_periodically'));
  displayOptionDescription();
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

  var parameters = [];
  for (const option in settings) {
    if (settings.hasOwnProperty(option)) {
      let value = settings[option];

      switch (option) {
        case "--stapm-limit=":
        case "--fast-limit=":
        case "--slow-limit=":
        case "--stapm-time=":
          value = value * 1000;
          break;

        case "--tctl-temp=":
        case "--max-fclk-frequency=":
        case "--min-fclk-frequency=":
          value = value;
          break;

        case "--max-gfxclk-frequency=":
        case "--min-gfxclk-frequency=":
        case "--max-socclk-frequency=":
        case "--min-socclk-frequency=":
          value = parseInt(value / 10) * 10;
          break;

        case "--psi0-current=":
        case "--vrmmax-current=":
          value = '0x' + decimalToHexString(value * 1000);
          break;

        default:
          break;
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
