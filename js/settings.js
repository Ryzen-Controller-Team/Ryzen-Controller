function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
ready(function(){
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
});

function getCurrentWorkingDirectory() {
  return require('electron').remote.app.getAppPath();
}

function decimalToHexString(number) {
  if (number < 0)
  {
    number = 0xFFFFFFFF + number + 1;
  }

  return number.toString(16).toUpperCase();
}

function applyRyzenSettings(e) {
  const settings = {
    "--stapm-limit=": document.getElementById('stapm_limit_w').value,
    "--fast-limit=": document.getElementById('ppt_fast_limit_w').value,
    "--slow-limit=": document.getElementById('ppt_slow_limit_w').value,
    "--tctl-temp=": document.getElementById('temperature_limit_c').value,
    "--vrmmax-current=": document.getElementById('vrm_current_m_a').value,
  };
  console.log(settings);

  const child = require('child_process').execFile;
  const executablePath = getCurrentWorkingDirectory() + "\\bin\\ryzenadj.exe";

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
       console.log(err)
       console.log(data.toString());
  });

}
