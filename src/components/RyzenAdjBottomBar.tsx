import * as React from "react";
import RyzenControllerAppContext, { defaultPreset } from "../contexts/RyzenControllerAppContext";
import Notification from "../contexts/NotificationContext";
import { createRyzenAdjCommandLine, executeRyzenAdj } from "../contexts/RyzenAdjContext";
import LightModeContext from "../contexts/LightModeContext";

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
                      Apply
                    </button>
                    <button
                      className="uk-button uk-button-default uk-margin-left"
                      onClick={this.createNewPreset(ryzenControllerAppContext)}
                    >
                      Create preset
                    </button>
                    <button
                      className="uk-button uk-button-default uk-margin-left"
                      onClick={this.reset(ryzenControllerAppContext)}
                    >
                      Reset
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
      UIkit.modal.prompt("New preset name", "").then((newPresetName: string | null) => {
        if (newPresetName === null) {
          return;
        } else if (newPresetName.length <= 0) {
          Notification.warning("You must provide a name");
        } else if (ryzenControllerAppContext.presets.hasOwnProperty(newPresetName)) {
          Notification.warning(`A preset with the name "${newPresetName}" already exist`);
        } else {
          ryzenControllerAppContext.addPreset(newPresetName, ryzenControllerAppContext.currentSettings);
          Notification.success(`Preset "${newPresetName}" created`);
        }
      });
    };
  }

  apply(ryzenControllerAppContext: RyzenControllerAppContextType) {
    return function() {
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
