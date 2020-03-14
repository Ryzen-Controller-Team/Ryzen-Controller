import * as React from "react";
import RyzenControllerAppContext, { defaultPreset, isPresetValid } from "../contexts/RyzenControllerAppContext";
import Notification from "../contexts/NotificationContext";
import { createRyzenAdjCommandLine, executeRyzenAdj } from "../contexts/RyzenAdjContext";
import LightModeContext from "../contexts/LightModeContext";
import NotificationContext from "../contexts/NotificationContext";
import { getTranslation } from "../contexts/LocaleContext";

const UIkit = require("uikit");

class RyzenAdjBottomBar extends React.PureComponent {
  render() {
    return (
      <LightModeContext.Consumer>
        {lightModeContext => {
          return (
            <RyzenControllerAppContext.Consumer>
              {ryzenControllerAppContext => {
                const classes =
                  lightModeContext.mode === "light"
                    ? "uk-dark uk-background-default uk-card uk-card-default"
                    : "uk-light uk-background-primary";
                return (
                  <div className={`uk-padding-small uk-position-fixed uk-position-bottom-right ${classes}`}>
                    <button className="uk-button uk-button-primary" onClick={this.apply(ryzenControllerAppContext)}>
                      {getTranslation("ryzenAdjBottomBar.apply", "Apply")}
                    </button>
                    <button
                      className="uk-button uk-button-default uk-margin-left"
                      onClick={this.createNewPreset(ryzenControllerAppContext)}
                    >
                      {getTranslation("ryzenAdjBottomBar.createPreset", "Create preset")}
                    </button>
                    <button
                      className="uk-button uk-button-default uk-margin-left"
                      onClick={this.reset(ryzenControllerAppContext)}
                    >
                      {getTranslation("ryzenAdjBottomBar.reset", "Reset")}
                    </button>
                  </div>
                );
              }}
            </RyzenControllerAppContext.Consumer>
          );
        }}
      </LightModeContext.Consumer>
    );
  }

  createNewPreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return function() {
      const promptMessage = getTranslation("ryzenAdjBottomBar.prompt", "New preset name");
      const mustProvideNameMessage = getTranslation("ryzenAdjBottomBar.mustProvideName", "You must provide a name");

      UIkit.modal.prompt(promptMessage, "").then((newPresetName: string | null) => {
        if (newPresetName === null) {
          return;
        } else if (newPresetName.length <= 0) {
          Notification.warning(mustProvideNameMessage);
        } else if (ryzenControllerAppContext.presets.hasOwnProperty(newPresetName)) {
          const presetWithSameNameExistMessage = getTranslation(
            "ryzenAdjBottomBar.presetWithSameNameExist",
            'A preset with the name "{newPresetName}" already exist',
            { newPresetName: newPresetName }
          );
          Notification.warning(presetWithSameNameExistMessage);
        } else {
          ryzenControllerAppContext.addPreset(newPresetName, ryzenControllerAppContext.currentSettings);
          const presetCreatedMessage = getTranslation(
            "ryzenAdjBottomBar.presetCreated",
            'Preset "{newPresetName}" created',
            { newPresetName: newPresetName }
          );
          Notification.success(presetCreatedMessage);
        }
      });
    };
  }

  apply(ryzenControllerAppContext: RyzenControllerAppContextType) {
    return function() {
      if (!isPresetValid(ryzenControllerAppContext.currentSettings)) {
        NotificationContext.warning(
          getTranslation("ryzenAdjBottomBar.invalidPreset", "Unable to apply invalid preset")
        );
        return;
      }
      ryzenControllerAppContext.updateLatestSettings();
      executeRyzenAdj(createRyzenAdjCommandLine(ryzenControllerAppContext.currentSettings));
    };
  }

  reset(ryzenControllerAppContext: RyzenControllerAppContextType) {
    return function() {
      ryzenControllerAppContext.updateCurrentSettings(defaultPreset);
    };
  }
}

export default RyzenAdjBottomBar;
