import { createContext } from "react";
import { getOptionDefinition, executeRyzenAdj, createRyzenAdjCommandLine } from "./RyzenAdjContext";
import { isNumber } from "util";
import compareVersions from "compare-versions";
import NotificationContext from "./NotificationContext";
const isDev = window.require("electron-is-dev");
const electronSettings = window.require("electron-settings");
const fileSystem = window.require("fs");
const app_version_as_string = process.env?.REACT_APP_VERSION?.replace(/\./g, "_") || "dev";

const defaultPreset = {
  "--slow-time=": { enabled: false, value: getOptionDefinition("--slow-time=").default },
  "--psi0-current=": { enabled: false, value: getOptionDefinition("--psi0-current=").default },
  "--vrmmax-current=": { enabled: false, value: getOptionDefinition("--vrmmax-current=").default },
  "--min-gfxclk=": { enabled: false, value: getOptionDefinition("--min-gfxclk=").default },
  "--max-gfxclk=": { enabled: false, value: getOptionDefinition("--max-gfxclk=").default },
  "--min-fclk-frequency=": { enabled: false, value: getOptionDefinition("--min-fclk-frequency=").default },
  "--max-fclk-frequency=": { enabled: false, value: getOptionDefinition("--max-fclk-frequency=").default },
  "--tctl-temp=": { enabled: false, value: getOptionDefinition("--tctl-temp=").default },
  "--stapm-limit=": { enabled: false, value: getOptionDefinition("--stapm-limit=").default },
  "--stapm-time=": { enabled: false, value: getOptionDefinition("--stapm-time=").default },
  "--fast-limit=": { enabled: false, value: getOptionDefinition("--fast-limit=").default },
  "--slow-limit=": { enabled: false, value: getOptionDefinition("--slow-limit=").default },
};

const getRyzenAdjExecutablePath = function(): string {
  const cwd = window.require("electron").remote.app.getAppPath();
  let path: string | undefined = electronSettings.get(app_version_as_string)?.settings?.ryzenAdjPath;

  if (path) {
    return path;
  }
  path = `${cwd}\\${isDev ? "public\\" : "build\\"}bin\\ryzenadj.exe`;
  return path;
};

const RyzenControllerSettingsDefinitions: RyzenControllerSettingDefinitionList = {
  autoStartOnBoot: {
    displayTitle: false,
    name: "Auto start on boot",
    type: "boolean",
    default: false,
    short_description: "Launch Ryzen Controller on computer start.",
    compatibility: {
      linux: false,
      win32: true,
    },
    apply(toBeEnabled) {
      const AutoLaunch = window.require("auto-launch");
      let autoLaunch = new AutoLaunch({
        name: "Ryzen Controller",
      });

      return new Promise((resolve, reject) => {
        autoLaunch.isEnabled().then((isEnabled: boolean) => {
          try {
            if (isEnabled) {
              autoLaunch.disable();
            }
            if (toBeEnabled) {
              autoLaunch.enable();
            }
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
  },
  minimizeOnLaunch: {
    displayTitle: false,
    name: "Minimize on launch",
    type: "boolean",
    default: false,
    short_description: "Launch Ryzen Controller minimized.",
    compatibility: {
      linux: true,
      win32: true,
    },
    apply() {
      return new Promise(resolve => {
        resolve(true);
      });
    },
  },
  minimizeToTray: {
    displayTitle: false,
    name: "Minimize to tray",
    type: "boolean",
    default: false,
    short_description: "Minimize Ryzen Controller to tray instead of taskbar.",
    compatibility: {
      linux: true,
      win32: true,
    },
    apply() {
      return new Promise(resolve => {
        resolve(true);
      });
    },
  },
  reApplyPeriodically: {
    displayTitle: true,
    name: "Re-apply periodically",
    type: "range",
    default: 0,
    short_description: "Allow you to re-apply RyzenAdj settings periodically (every X seconds).",
    description:
      "On some laptops, the bios sometimes reset what RyzenAdj is trying to do. You can use this to apply the settings periodically.",
    compatibility: {
      linux: true,
      win32: true,
    },
    apply(seconds) {
      // @ts-ignore
      let parsedSeconds: number = parseInt(seconds) >= 0 ? parseInt(seconds) * 1000 : 0;
      if (!isNumber(parsedSeconds)) {
        return new Promise((resolve, reject) => {
          reject("ERROR: Value must be of number type.");
        });
      }
      return new Promise((resolve, reject) => {
        try {
          let intervalId = electronSettings.get("reApplyPeriodically");
          clearInterval(intervalId);
          intervalId = false;
          electronSettings.set("reApplyPeriodically", false);

          if (parsedSeconds <= 0) {
            resolve(false);
            return;
          }

          electronSettings.set(
            "reApplyPeriodically",
            setInterval(() => {
              executeRyzenAdj(
                createRyzenAdjCommandLine(electronSettings.get(app_version_as_string).currentSettings),
                false
              );
            }, parsedSeconds)
          );
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
  },
  ryzenAdjPath: {
    displayTitle: true,
    name: "RyzenAdj path",
    type: "path",
    default: "\\bin\\ryzenadj.exe",
    short_description: "The full path to ryzenadj binary.",
    compatibility: {
      linux: true,
      win32: true,
    },
    apply(path) {
      return new Promise((resolve, reject) => {
        if (!path) {
          path = getRyzenAdjExecutablePath();
        }
        if (!fileSystem.existsSync(path)) {
          reject("Path to ryzenadj.exe is wrong, please fix it in settings tab.");
        }
        resolve(true);
      });
    },
  },
  onLaptopPluggedIn: {
    displayTitle: false,
    name: "",
    type: "path",
    default: false,
    short_description: "",
    compatibility: {
      linux: false,
      win32: false,
    },
    apply() {
      return new Promise(resolve => {
        resolve(true);
      });
    },
  },
  onLaptopPluggedOut: {
    displayTitle: false,
    name: "",
    type: "path",
    default: false,
    short_description: "",
    compatibility: {
      linux: false,
      win32: false,
    },
    apply() {
      return new Promise(resolve => {
        resolve(true);
      });
    },
  },
  onRCStart: {
    displayTitle: false,
    name: "",
    type: "path",
    default: false,
    short_description: "",
    compatibility: {
      linux: false,
      win32: false,
    },
    apply() {
      return new Promise(resolve => {
        resolve(true);
      });
    },
  },
  onSessionResume: {
    displayTitle: false,
    name: "",
    type: "path",
    default: false,
    short_description: "",
    compatibility: {
      linux: false,
      win32: false,
    },
    apply() {
      return new Promise(resolve => {
        resolve(true);
      });
    },
  },
};

const getSettingDefinition = function(
  name: keyof RyzenControllerSettingDefinitionList
): RyzenControllerSettingDefinition | false {
  if (RyzenControllerSettingsDefinitions.hasOwnProperty(name)) {
    return RyzenControllerSettingsDefinitions[name];
  }
  return false;
};

const defaultRyzenControllerAppContext: RyzenControllerAppContextType = {
  latestSettings: defaultPreset,
  currentSettings: defaultPreset,
  presets: {},
  settings: {
    autoStartOnBoot: false,
    minimizeOnLaunch: false,
    minimizeToTray: false,
    reApplyPeriodically: false,
    ryzenAdjPath: "",
    onLaptopPluggedIn: false,
    onLaptopPluggedOut: false,
    onRCStart: false,
    onSessionResume: false,
  },
  updateLatestSettings() {},
  updateCurrentSettings(list) {},
  addPreset(name, preset) {},
  removePreset(name) {},
  updateSettings(settings) {},
  isPresetValid(preset) {
    try {
      for (const key in preset) {
        if (!defaultPreset.hasOwnProperty(key)) {
          console.error(`ERROR: key "${key}" in preset does not exist in defaultPreset.`);
          return false;
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  },
};

let loadedContext = window.require("electron-settings").get(app_version_as_string);
let context = defaultRyzenControllerAppContext;
if (loadedContext) {
  context = {
    ...defaultRyzenControllerAppContext,
    ...loadedContext,
  };
}

const RyzenControllerAppContext = createContext<RyzenControllerAppContextType>(context);
RyzenControllerAppContext.displayName = "RyzenControllerAppContext";

const persistentSave = function(context: RyzenControllerAppContextType) {
  let savedContext: RyzenControllerAppContextType = {
    ...context,
    currentSettings: context.latestSettings,
  };
  window.require("electron-settings").set(app_version_as_string, savedContext);
};

const executeRyzenAdjUsingPreset = function(presetName: string): boolean {
  const presets = electronSettings.get(app_version_as_string)?.presets;
  if (!presets.hasOwnProperty(presetName)) {
    return false;
  }
  executeRyzenAdj(createRyzenAdjCommandLine(presets[presetName]));
  return true;
};

const checkIfNewerReleaseExist = function(): void {
  const currentVersion = process.env?.REACT_APP_VERSION;
  if (!currentVersion) {
    return;
  }

  fetch("https://gitlab.com/api/v4/projects/11046417/releases")
    .then(response => response.json())
    .then(data => {
      const last_released_version = data[0]?.tag_name;
      if (!last_released_version) {
        throw new Error("Unable to check for new release");
      }
      if (compareVersions.compare(currentVersion, last_released_version, "<")) {
        return true;
      }
      return false;
    })
    .then((isNewReleaseExist: boolean) => {
      if (isNewReleaseExist) {
        NotificationContext.talk("A new release is available, please check the release tab.");
      }
    })
    .catch(err => {
      console.warn(err);
    });
};

export default RyzenControllerAppContext;
export {
  context as defaultRyzenControllerAppContext,
  defaultPreset,
  persistentSave,
  RyzenControllerSettingsDefinitions,
  getSettingDefinition,
  getRyzenAdjExecutablePath,
  app_version_as_string,
  executeRyzenAdjUsingPreset,
  checkIfNewerReleaseExist as checkNewVersion,
};
