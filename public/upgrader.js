const electronSettings = require("electron-settings");

const electron = require("electron");
const isDev = require("electron-is-dev");
const app = electron.app;
const app_version_as_string = app.getVersion().replace(/\./g, "_") + (isDev ? "-dev" : "");

function storageHaveCurrentVersion() {
  return typeof electronSettings.get(app_version_as_string) === "object";
}

function getAllAvailableVersion() {
  var keys = Object.keys(electronSettings.getAll());
  var versionAsRegex = isDev ? /^\d*_\d*_\d*(-dev)$/ : /^\d*_\d*_\d*$/;
  var validKeys = keys.filter((val, index) => {
    return versionAsRegex.test(val);
  });
  validKeys.push(app_version_as_string);
  validKeys.sort((a, b) => {
    return a.localeCompare(b);
  });
  return validKeys;
}

function storageHasPreviousVersion() {
  var validKeys = getAllAvailableVersion();
  return validKeys.indexOf(app_version_as_string) > 0;
}

function getPreviousVersion() {
  var validKeys = getAllAvailableVersion();
  const index = validKeys.indexOf(app_version_as_string);
  return validKeys[index - 1];
}

/**
 * Upgrade from any version to above.
 * 
 * Just a copy from the previous version to the new one.
 * Not executed if the previous version is a special case, see upgradeFromPreviousVersion() below.
 */
function from_any_copyStorage(previousVersion) {
  electronSettings.set(`${app_version_as_string}`, electronSettings.get(previousVersion));
}

/**
 * Upgrade from 2.0.0 to above.
 * 
 * Some of the storage was not under the version scope,
 * We move those so the storage is more secure and consistent from version to version.
 */
function from_2_0_0_MoveAppContext(previousVersion) {
  electronSettings.set(`${app_version_as_string}.appContext`, electronSettings.get(previousVersion));
}
function from_2_0_0_MoveLightMode() {
  electronSettings.set(`${app_version_as_string}.lightMode`, electronSettings.get("lightMode"));
}
function from_2_0_0_MoveLocale() {
  electronSettings.set(`${app_version_as_string}.locale`, electronSettings.get("locale"));
}
function from_2_0_0_MoveReApplyPeriodically() {
  electronSettings.set(`${app_version_as_string}.reApplyPeriodically`, electronSettings.get("reApplyPeriodically"));
}
function from_2_0_0_MoveVotedPresets() {
  electronSettings.set(`${app_version_as_string}.votedPresets`, electronSettings.get("votedPresets"));
}

function upgradeFromPreviousVersion() {
  if (isDev) console.log("Upgrading storage...");
  const previousVersion = getPreviousVersion();
  switch (previousVersion) {
    case "2_0_0":
    case "2_0_0-dev":
      from_2_0_0_MoveAppContext(previousVersion);
      from_2_0_0_MoveLightMode(previousVersion);
      from_2_0_0_MoveLocale(previousVersion);
      from_2_0_0_MoveReApplyPeriodically(previousVersion);
      from_2_0_0_MoveVotedPresets(previousVersion);
      if (isDev) console.log("... from 2.0.0");
      break;

    default:
      from_any_copyStorage(previousVersion);
      break;
  }
}

const upgrader = () => {
  if (storageHaveCurrentVersion()) {
    // No need to upgrade.
    return;
  }
  if (!storageHasPreviousVersion()) {
    // No need to upgrade.
    return;
  }
  upgradeFromPreviousVersion();
};

module.exports = upgrader;
