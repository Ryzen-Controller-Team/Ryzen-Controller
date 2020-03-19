import * as React from "react";
import RyzenControllerAppContext, { defaultPreset, isPresetValid } from "../contexts/RyzenControllerAppContext";
import Notification from "../contexts/NotificationContext";
import { createRyzenAdjCommandLine, executeRyzenAdj } from "../contexts/RyzenAdjContext";
import LightModeContext from "../contexts/LightModeContext";
import NotificationContext from "../contexts/NotificationContext";
import { getTranslation, variablesInTranslation } from "../contexts/LocaleContext";

const UIkit = require("uikit");

const applyText = getTranslation("ryzenAdjBottomBar.apply", "Apply");
const createPresetText = getTranslation("ryzenAdjBottomBar.createPreset", "Create preset");
const resetText = getTranslation("ryzenAdjBottomBar.reset", "Reset");
const promptText = getTranslation("ryzenAdjBottomBar.prompt", "New preset name");
const mustProvideNameText = getTranslation("ryzenAdjBottomBar.mustProvideName", "You must provide a name");
const presetCreatedText = getTranslation("ryzenAdjBottomBar.presetCreated", 'Preset "{newPresetName}" created');
const invalidPresetText = getTranslation("ryzenAdjBottomBar.invalidPreset", "Unable to apply invalid preset");
const presetWithSameNameExistText = getTranslation(
  "ryzenAdjBottomBar.presetWithSameNameExist",
  'A preset with the name "{newPresetName}" already exist'
);

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
                      {applyText}
                    </button>
                    <button
                      className="uk-button uk-button-default uk-margin-left"
                      onClick={this.createNewPreset(ryzenControllerAppContext)}
                    >
                      {createPresetText}
                    </button>
                    <button
                      className="uk-button uk-button-default uk-margin-left"
                      onClick={this.reset(ryzenControllerAppContext)}
                    >
                      {resetText}
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
      const promptMessage = promptText;
      const mustProvideNameMessage = mustProvideNameText;

      UIkit.modal.prompt(promptMessage, "").then((newPresetName: string | null) => {
        if (newPresetName === null) {
          return;
        } else if (newPresetName.length <= 0) {
          Notification.warning(mustProvideNameMessage);
        } else if (ryzenControllerAppContext.presets.hasOwnProperty(newPresetName)) {
          const presetWithSameNameExistTextVariable = variablesInTranslation(presetWithSameNameExistText, {
            newPresetName: newPresetName,
          });
          Notification.warning(presetWithSameNameExistTextVariable);
        } else {
          ryzenControllerAppContext.addPreset(newPresetName, ryzenControllerAppContext.currentSettings);

          const presetCreatedTextVariable = variablesInTranslation(presetCreatedText, { newPresetName: newPresetName });
          Notification.success(presetCreatedTextVariable);
        }
      });
    };
  }

  apply(ryzenControllerAppContext: RyzenControllerAppContextType) {
    return function() {
      if (!isPresetValid(ryzenControllerAppContext.currentSettings)) {
        NotificationContext.warning(invalidPresetText);
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
