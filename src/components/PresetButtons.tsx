import * as React from "react";
import NotificationContext from "../contexts/NotificationContext";
import RyzenControllerAppContext, { executeRyzenAdjUsingPreset } from "../contexts/RyzenControllerAppContext";

type PresetButtonsProps = {
  presetName: string;
  preset: RyzenAdjOptionListType;
};

class PresetButtons extends React.PureComponent<PresetButtonsProps, {}> {
  render() {
    return (
      <RyzenControllerAppContext.Consumer>
        {(ryzenControllerAppContext: RyzenControllerAppContextType) => (
          <div className="uk-flex uk-flex-right uk-flex-middle uk-height-1-1 uk-flex-wrap">
            <div className="uk-button-group uk-margin-right">
              <button
                className="uk-button uk-button-small uk-button-primary"
                uk-tooltip="title: The preset will be loaded in RyzenAdj's tabs and applied."
                onClick={this.applyPreset(ryzenControllerAppContext)}
              >
                Apply
              </button>
              <button
                className="uk-button uk-button-small uk-button-danger"
                onClick={this.removePreset(ryzenControllerAppContext)}
              >
                Delete
              </button>
            </div>
            <div className="uk-button-group uk-margin-right">
              <button
                className="uk-button uk-button-small uk-button-default"
                uk-tooltip="title: The preset will be loaded in RyzenAdj's tabs but not applied."
                onClick={this.loadPreset(ryzenControllerAppContext)}
              >
                Load
              </button>
              <button
                className="uk-button uk-button-small uk-button-default"
                onClick={this.uploadPreset(ryzenControllerAppContext)}
              >
                Upload
              </button>
            </div>
          </div>
        )}
      </RyzenControllerAppContext.Consumer>
    );
  }

  applyPreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined {
    return () => {
      ryzenControllerAppContext.updateCurrentSettings(this.props.preset);
      executeRyzenAdjUsingPreset(this.props.presetName);
    };
  }

  uploadPreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      // @TODO implement upload
      NotificationContext.talk(`Soon™`);
    };
  }

  loadPreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      ryzenControllerAppContext.updateCurrentSettings(this.props.preset);
      NotificationContext.talk(`Preset ${this.props.presetName} has been loaded.`);
    };
  }

  removePreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      require("uikit")
        .modal.confirm(`Are you sure to delete "${this.props.presetName}"?`)
        .then(() => {
          ryzenControllerAppContext.removePreset(this.props.presetName);
        })
        .catch(() => {});
    };
  }
}

export default PresetButtons;
