import { createContext } from "react";
import { getOptionDefinition, executeRyzenAdj, createRyzenAdjCommandLine } from "./RyzenAdjContext";
import { isNumber } from "util";
import compareVersions from "compare-versions";
import NotificationContext from "./NotificationContext";
import { getTranslation } from "./LocaleContext";
import AppVersion from './AppVersion';

const isDev = window.require("electron-is-dev");
const electronSettings = window.require("electron-settings");
const reApplyPeriodicallySettingsKey = `${AppVersion.string}.reApplyPeriodically`;
const appContextSettingsKey = `${AppVersion.string}.appContext`;
const fileSystem = window.require("fs");

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
  let path: string | undefined = electronSettings.get(appContextSettingsKey)?.settings?.ryzenAdjPath;

  if (path) {
    return path;
  }
  path = `${cwd}\\${isDev ? "public\\" : "build\\"}bin\\ryzenadj.exe`;
  return path;
};

const RyzenControllerSettingsDefinitions: RyzenControllerSettingDefinitionList = {
  autoStartOnBoot: {
    displayTitle: false,
    name: getTranslation("appContext.autoStartOnBoot.name", "Auto start on boot"),
    type: "boolean",
    default: false,
    short_description: getTranslation(
      "appContext.autoStartOnBoot.shortDesc",
      "Launch Ryzen Controller on computer start."
    ),
    compatibility: {
      linux: false,
      win32: true,
    },
    apply(toBeEnabled) {
      const platform: "win32" | "linux" = window.require("os").platform();
      const AutoLaunch = window.require("auto-launch");
      let autoLaunch = new AutoLaunch({
        name: "Ryzen Controller",
      });

      return new Promise((res, rej) => {
        if (platform === "linux") {
          return autoLaunch.isEnabled().then((isEnabled: boolean) => {
            try {
              if (isEnabled) {
                autoLaunch.disable();
              }
              if (toBeEnabled) {
                autoLaunch.enable();
              }
              return true;
            } catch (error) {
              return error;
            }
          });
        } else if (platform === "win32") {
          // Ensure the old autolaunch has been deleted.
          autoLaunch.isEnabled().then((isEnabled: boolean) => {
            try {
              if (isEnabled) {
                autoLaunch.disable();
              }
            } catch (error) {
              console.log(error);
            }
          });

          // Handle new auto launch system.
          const path = `${window
            .require("electron")
            .remote.app.getAppPath()}.unpacked\\build\\bin\\auto-start-ryzen-controller.bat`;
          try {
            window.require("electron").remote.app.setLoginItemSettings({
              openAtLogin: toBeEnabled,
              path: path,
            });
          } catch (error) {
            rej(error);
          }
          res(true);
        }
      });
    },
  },
  minimizeOnLaunch: {
    displayTitle: false,
    name: getTranslation("appContext.minimizeOnLaunch.name", "Minimize on launch"),
    type: "boolean",
    default: false,
    short_description: getTranslation("appContext.minimizeOnLaunch.shortDesc", "Launch Ryzen Controller minimized."),
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
    name: getTranslation("appContext.minimizeToTray.name", "Minimize to tray"),
    type: "boolean",
    default: false,
    short_description: getTranslation(
      "appContext.minimizeToTray.shortDesc",
      "Minimize Ryzen Controller to tray instead of taskbar."
    ),
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
    name: getTranslation("appContext.reApplyPeriodically.name", "Re-apply periodically"),
    type: "range",
    default: 0,
    short_description: getTranslation(
      "appContext.reApplyPeriodically.shortDesc",
      "Allow you to re-apply RyzenAdj settings periodically (every X seconds)."
    ),
    description: getTranslation(
      "appContext.reApplyPeriodically.desc",
      "On some laptops, the bios sometimes reset what RyzenAdj is trying to do. You can use this to apply the settings periodically."
    ),
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
          let intervalId = electronSettings.get(reApplyPeriodicallySettingsKey);
          clearInterval(intervalId);
          intervalId = false;
          electronSettings.set(reApplyPeriodicallySettingsKey, false);

          if (parsedSeconds <= 0) {
            resolve(false);
            return;
          }

          electronSettings.set(
            reApplyPeriodicallySettingsKey,
            setInterval(() => {
              let preset = electronSettings.get(appContextSettingsKey).currentSettings;
              if (!isPresetValid(preset)) {
                return;
              }
              executeRyzenAdj(createRyzenAdjCommandLine(preset), false);
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
    name: getTranslation("appContext.ryzenAdjPath.name", "RyzenAdj path"),
    type: "path",
    default: "\\bin\\ryzenadj.exe",
    short_description: getTranslation("appContext.ryzenAdjPath.shortDesc", "The full path to ryzenadj binary."),
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
          reject(
            getTranslation(
              "appContext.ryzenAdjPath.wrongPath",
              "Path to ryzenadj.exe is wrong, please fix it in settings tab."
            )
          );
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
};

const isPresetValid = function(preset: PartialRyzenAdjOptionListType): boolean {
  try {
    for (const key in preset) {
      // @ts-ignore
      const arg: RyzenAdjArguments = key;
      if (!defaultPreset.hasOwnProperty(arg)) {
        throw new Error(`ERROR: key "${arg}" in preset does not exist in defaultPreset.`);
      } else {
        const value = preset[arg]?.value || -1;
        const min = getOptionDefinition(arg).min;
        const max = getOptionDefinition(arg).max;
        if (min > value || value > max) {
          throw new Error(`ERROR: "${arg}" with value ${value} is out of bound (${min} - ${max}) in preset.`);
        }
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

let loadedContext = electronSettings.get(appContextSettingsKey);
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
  electronSettings.set(appContextSettingsKey, savedContext);
};

const executeRyzenAdjUsingPreset = function(presetName: string): boolean {
  const presets = electronSettings.get(appContextSettingsKey)?.presets;
  if (!presets.hasOwnProperty(presetName)) {
    return false;
  }
  if (!isPresetValid(presets[presetName])) {
    NotificationContext.warning(getTranslation("appContext.invalidPreset", "Unable to apply invalid preset"));
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
        NotificationContext.talk(
          getTranslation("appContext.newReleaseAvailable", "A new release is available, please check the release tab.")
        );
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
  executeRyzenAdjUsingPreset,
  checkIfNewerReleaseExist as checkNewVersion,
  isPresetValid,
};
