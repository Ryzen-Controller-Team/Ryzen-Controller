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
  return require('electron').remote.app.getAppPath();
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
       `Warning: you should launch this app as administrator,
        ryzenadj.exe doesn't seems to work correctly without administrator rights.
      `);
    }
  });
}

/**
 * Will display a notification in ".notification-zone".
 * @param {string} type "primary", "warning", "danger" or "success".
 * @param {string} message The message to be displayed, new line will be replaced by <br/>.
 */
function notification(type, message) {
  var element = parseHTML(`
  <div class="uk-alert-${type}" uk-alert>
    <a class="uk-alert-close" uk-close></a>
    <p>${(''+message).replace(/(?:\r\n|\r|\n)/g, '<br/>')}</p>
  </div>`);
  var notifZone = document.getElementById('notification-zone');
  notifZone.appendChild(element[0]);
}