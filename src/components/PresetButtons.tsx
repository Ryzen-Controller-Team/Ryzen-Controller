import * as React from "react";
import NotificationContext from "../contexts/NotificationContext";
import RyzenControllerAppContext, { executeRyzenAdjUsingPreset } from "../contexts/RyzenControllerAppContext";
import SysInfoContext from "../contexts/SysInfoContext";
import PresetsOnlineContext from "../contexts/PresetsOnline";
import { getTranslation, variablesInTranslation } from "../contexts/LocaleContext";

const applyBtnText = getTranslation("presetButtons.apply", "Apply");
const deleteBtnText = getTranslation("presetButtons.delete", "Delete");
const loadBtnText = getTranslation("presetButtons.load", "Load");
const uploadBtnText = getTranslation("presetButtons.upload", "Upload");
const uploadSucceedText = getTranslation("presetButtons.uploadSucceed", "Preset {preset} has been uploaded");
const uploadErrorText = getTranslation("presetButtons.uploadError", "An error occured while uploading the preset");
const loadedPresetText = getTranslation("presetButtons.loadedPreset", "Preset {preset} has been loaded.");
const confirmDeletionText = getTranslation("presetButtons.confirmDeletion", 'Are you sure to delete "{preset}"?');
const applyPresetTooltip = getTranslation(
  "presetButtons.applyPresetTooltip",
  "The preset will be loaded in RyzenAdj's tabs and applied."
);
const loadPresetTooltip = getTranslation(
  "presetButtons.loadPresetTooltip",
  "The preset will be loaded in RyzenAdj's tabs but not applied."
);
const mustWaitForSignatureGenText = getTranslation(
  "presetButtons.mustWaitForSignatureGen",
  "You must wait for laptop signature to be generated"
);
const presetWithSameNameAlreadyExistOnlineText = getTranslation(
  "presetButtons.presetWithSameNameAlreadyExistOnline",
  "A preset with the same name already exist online"
);
const uploadPresetConfirmationText = getTranslation(
  "presetButtons.uploadPresetConfirmation",
  "Are you sure to upload the preset {preset}?"
);

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
                uk-tooltip={`title: ${applyPresetTooltip}`}
                onClick={this.applyPreset(ryzenControllerAppContext)}
              >
                {applyBtnText}
              </button>
              <button
                className="uk-button uk-button-small uk-button-danger"
                onClick={this.removePreset(ryzenControllerAppContext)}
              >
                {deleteBtnText}
              </button>
            </div>
            <div className="uk-button-group uk-margin-right">
              <button
                className="uk-button uk-button-small uk-button-default"
                uk-tooltip={`title: ${loadPresetTooltip}`}
                onClick={this.loadPreset(ryzenControllerAppContext)}
              >
                {loadBtnText}
              </button>
              <SysInfoContext.Consumer>
                {sysinfo => (
                  <PresetsOnlineContext.Consumer>
                    {(presetsOnlineContext: PresetsOnlineContextType) => (
                      <button
                        className="uk-button uk-button-small uk-button-default"
                        onClick={this.uploadPreset(
                          presetsOnlineContext,
                          sysinfo.signature,
                          sysinfo.permissiveSignature
                        )}
                      >
                        {uploadBtnText}
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
    signature: string | false,
    permissiveSignature: string | false
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      if (!signature || !permissiveSignature) {
        NotificationContext.warning(mustWaitForSignatureGenText);
        return;
      }
      let presetsWithSameName = presetsOnlineContext.list.filter((preset: ApiPreset) => {
        return (
          preset.name === this.props.presetName &&
          (preset.systemHash === signature || preset.permissiveSystemHash === permissiveSignature)
        );
      });
      if (presetsWithSameName.length > 0) {
        NotificationContext.warning(presetWithSameNameAlreadyExistOnlineText);
        return;
      }
      const uploadPresetConfirmationTextVariable = variablesInTranslation(uploadPresetConfirmationText, {
        preset: this.props.presetName,
      });
      window
        .require("uikit")
        .modal.confirm(uploadPresetConfirmationTextVariable)
        .then(() => {
          presetsOnlineContext
            .uploadPreset({
              name: this.props.presetName,
              systemHash: signature,
              permissiveSystemHash: permissiveSignature,
              ryzenAdjArguments: this.props.preset,
            })
            .then(value => {
              const uploadSucceedTextVariable = variablesInTranslation(uploadSucceedText, {
                preset: value.name,
              });
              NotificationContext.success(uploadSucceedTextVariable);
              presetsOnlineContext.update();
            })
            .catch(() => {
              NotificationContext.error(uploadErrorText);
            });
        });
    };
  }

  loadPreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      ryzenControllerAppContext.updateCurrentSettings(this.props.preset);
      const loadedPresetTextVariable = variablesInTranslation(loadedPresetText, {
        preset: this.props.presetName,
      });
      NotificationContext.talk(loadedPresetTextVariable);
    };
  }

  removePreset(
    ryzenControllerAppContext: RyzenControllerAppContextType
  ): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return () => {
      const confirmDeletionTextVariable = variablesInTranslation(confirmDeletionText, {
        preset: this.props.presetName,
      });
      require("uikit")
        .modal.confirm(confirmDeletionTextVariable)
        .then(() => {
          ryzenControllerAppContext.removePreset(this.props.presetName);
        })
        .catch(() => {});
    };
  }
}

export default PresetButtons;
