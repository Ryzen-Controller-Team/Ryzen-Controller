import * as React from "react";
import NotificationContext from "../contexts/NotificationContext";
import RyzenControllerAppContext, { executeRyzenAdjUsingPreset } from "../contexts/RyzenControllerAppContext";
import SysInfoContext from "../contexts/SysInfoContext";
import PresetsOnlineContext from "../contexts/PresetsOnline";
import { getTranslation } from "../contexts/LocaleContext";

type PresetButtonsProps = {
  presetName: string;
  preset: RyzenAdjOptionListType;
};

class PresetButtons extends React.Component<PresetButtonsProps, {}> {
  render() {
    return (
      <RyzenControllerAppContext.Consumer>
        {(ryzenControllerAppContext: RyzenControllerAppContextType) => (
          <div className="uk-flex uk-flex-right uk-flex-middle uk-height-1-1 uk-flex-wrap">
            <div className="uk-button-group uk-margin-right">
              <button
                className="uk-button uk-button-small uk-button-primary"
                uk-tooltip={`title: ${getTranslation(
                  "presetButtons.applyPresetTooltip",
                  "The preset will be loaded in RyzenAdj's tabs and applied."
                )}`}
                onClick={this.applyPreset(ryzenControllerAppContext)}
              >
                {getTranslation("presetButtons.apply", "Apply")}
              </button>
              <button
                className="uk-button uk-button-small uk-button-danger"
                onClick={this.removePreset(ryzenControllerAppContext)}
              >
                {getTranslation("presetButtons.delete", "Delete")}
              </button>
            </div>
            <div className="uk-button-group uk-margin-right">
              <button
                className="uk-button uk-button-small uk-button-default"
                uk-tooltip={`title: ${getTranslation(
                  "presetButtons.loadPresetTooltip",
                  "The preset will be loaded in RyzenAdj's tabs but not applied."
                )}`}
                onClick={this.loadPreset(ryzenControllerAppContext)}
              >
                {getTranslation("presetButtons.load", "Load")}
              </button>
              <SysInfoContext.Consumer>
                {sysinfo => (
                  <PresetsOnlineContext.Consumer>
                    {(presetsOnlineContext: PresetsOnlineContextType) => (
                      <button
                        className="uk-button uk-button-small uk-button-default"
                        onClick={this.uploadPreset(presetsOnlineContext, sysinfo.signature)}
                      >
                        {getTranslation("presetButtons.upload", "Upload")}
                      </button>
                    )}
                  </PresetsOnlineContext.Consumer>
                )}
              </SysInfoContext.Consumer>
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
    presetsOnlineContext: PresetsOnlineContextType,
    signature: string | false
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      if (!signature) {
        NotificationContext.warning(
          getTranslation("presetButtons.mustWaitForSignatureGen", "You must wait for laptop signature to be generated")
        );
        return;
      }
      let presetsWithSameName = presetsOnlineContext.list.filter(preset => {
        return preset.name === this.props.presetName && preset.systemHash === signature;
      });
      if (presetsWithSameName.length > 0) {
        NotificationContext.warning(
          getTranslation(
            "presetButtons.presetWithSameNameAlreadyExistOnline",
            "A preset with the same name already exist online"
          )
        );
        return;
      }
      window
        .require("uikit")
        .modal.confirm(
          getTranslation("presetButtons.uploadPresetConfirmation", "Are you sure to upload the preset {preset}?", {
            preset: this.props.presetName,
          })
        )
        .then(() => {
          presetsOnlineContext
            .uploadPreset({
              name: this.props.presetName,
              systemHash: signature,
              ryzenAdjArguments: this.props.preset,
            })
            .then(value => {
              NotificationContext.success(
                getTranslation("presetButtons.uploadSucceed", "Preset {preset} has been uploaded", {
                  preset: value.name,
                })
              );
              presetsOnlineContext.update();
            })
            .catch(() => {
              NotificationContext.error(
                getTranslation("presetButtons.uploadError", "An error occured while uploading the preset")
              );
            });
        });
    };
  }

  loadPreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      ryzenControllerAppContext.updateCurrentSettings(this.props.preset);
      NotificationContext.talk(
        getTranslation("presetButtons.loadedPreset", "Preset {preset} has been loaded.", {
          preset: this.props.presetName,
        })
      );
    };
  }

  removePreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      require("uikit")
        .modal.confirm(
          getTranslation("presetButtons.confirmDeletion", 'Are you sure to delete "{preset}"?', {
            preset: this.props.presetName,
          })
        )
        .then(() => {
          ryzenControllerAppContext.removePreset(this.props.presetName);
        })
        .catch(() => {});
    };
  }
}

export default PresetButtons;
