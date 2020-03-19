import * as React from "react";
import RyzenControllerAppContext, { isPresetValid } from "../contexts/RyzenControllerAppContext";
import NotificationContext from "../contexts/NotificationContext";
import PresetsOnlineContext from "../contexts/PresetsOnline";
import { getTranslation, variablesInTranslation } from "../contexts/LocaleContext";

const downloadText = getTranslation("presetOnlineBtn.download", "Download");
const presetLoadedText = getTranslation("presetOnlineBtn.presetLoaded", 'Preset "{presetName}" has been loaded');
const loadText = getTranslation("presetOnlineBtn.load", "Load");
const downloadTooltipText = getTranslation(
  "presetOnlineBtn.downloadTooltip",
  "Will save the preset to your local preset."
);
const presetSameNameExistText = getTranslation(
  "presetOnlineBtn.presetSameNameExist",
  "You already have a preset with the same name"
);
const presetInvalidOrObsoleteText = getTranslation(
  "presetOnlineBtn.presetInvalidOrObsolete",
  'Preset "{presetName}" is invalid or obsolete'
);
const presetDownloadedText = getTranslation(
  "presetOnlineBtn.presetDownloaded",
  'Preset "{presetName}" has been downloaded'
);
const loadTooltipText = getTranslation(
  "presetOnlineBtn.loadTooltip",
  "Without saving the preset, it will be loaded in RyzenAdj's tabs but not applied."
);

type PresetOnlineButtonsProps = {
  presetName: string;
  presetId: number;
  preset: RyzenAdjOptionListType;
  upvote: number;
  downvote: number;
};

function PresetOnlineButtons(props: PresetOnlineButtonsProps) {
  return (
    <div className="uk-flex uk-flex-right uk-flex-middle uk-height-1-1 uk-flex-wrap">
      <RyzenControllerAppContext.Consumer>
        {(ryzenControllerAppContext: RyzenControllerAppContextType) => (
          <div className="uk-button-group uk-margin-right">
            <button
              className="uk-button uk-button-small uk-button-primary"
              uk-tooltip={`title: ${downloadTooltipText}`}
              onClick={() => {
                if (ryzenControllerAppContext.presets.hasOwnProperty(props.presetName)) {
                  NotificationContext.warning(presetSameNameExistText);
                  return;
                }
                if (!isPresetValid(props.preset)) {
                  const presetInvalidOrObsoleteTextVariable = variablesInTranslation(presetInvalidOrObsoleteText, {
                    presetName: props.presetName,
                  });
                  NotificationContext.error(presetInvalidOrObsoleteTextVariable);
                  return;
                }
                ryzenControllerAppContext.addPreset(props.presetName, props.preset);
                const presetDownloadedTextVariable = variablesInTranslation(presetDownloadedText, {
                  presetName: props.presetName,
                });
                NotificationContext.talk(presetDownloadedTextVariable);
                return;
              }}
            >
              {downloadText}
            </button>
            <button
              className="uk-button uk-button-small uk-button-default"
              uk-tooltip={`title: ${loadTooltipText}`}
              onClick={() => {
                ryzenControllerAppContext.updateCurrentSettings(props.preset);
                const presetloadedTextVariable = variablesInTranslation(presetLoadedText, {
                  presetName: props.presetName,
                });
                NotificationContext.talk(presetloadedTextVariable);
              }}
            >
              {loadText}
            </button>
          </div>
        )}
      </RyzenControllerAppContext.Consumer>
      <PresetsOnlineContext.Consumer>
        {(presetsOnlineContext: PresetsOnlineContextType) => (
          <div className="uk-button-group uk-margin-right">
            <button
              className="uk-button uk-button-small uk-button-default"
              onClick={() => {
                presetsOnlineContext.upvote(props.presetId);
              }}
            >
              <span className="uk-margin-small-right" role="img" aria-label="upvote">
                👍
              </span>
              (+{props.upvote})
            </button>
            <button
              className="uk-button uk-button-small uk-button-default"
              onClick={() => {
                presetsOnlineContext.downvote(props.presetId);
              }}
            >
              <span className="uk-margin-small-right" role="img" aria-label="downvote">
                👎
              </span>
              ({props.downvote})
            </button>
          </div>
        )}
      </PresetsOnlineContext.Consumer>
    </div>
  );
}

export default PresetOnlineButtons;
