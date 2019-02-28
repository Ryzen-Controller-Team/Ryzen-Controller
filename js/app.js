ready(function(){
  registerRepeaterForAllInput();
  checkForAdminRights();
  preFillSettings();
  loadLatestUsedSettings();
});

/**
 * Will create and handle ryzenadj.exe execution.
 */
function applyRyzenSettings() {
  const settings = {
    "--stapm-limit=": document.getElementById('stapm_limit_w').value,
    "--fast-limit=": document.getElementById('ppt_fast_limit_w').value,
    "--slow-limit=": document.getElementById('ppt_slow_limit_w').value,
    "--tctl-temp=": document.getElementById('temperature_limit_c').value,
    "--vrmmax-current=": document.getElementById('vrm_current_m_a').value,
  };

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
