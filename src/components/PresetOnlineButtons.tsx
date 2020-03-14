import * as React from "react";
import RyzenControllerAppContext, { isPresetValid } from "../contexts/RyzenControllerAppContext";
import NotificationContext from "../contexts/NotificationContext";
import PresetsOnlineContext from "../contexts/PresetsOnline";
import { getTranslation } from "../contexts/LocaleContext";

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
              uk-tooltip={`title: ${getTranslation(
                "presetOnlineBtn.downloadTooltip",
                "Will save the preset to your local preset."
              )}`}
              onClick={() => {
                if (ryzenControllerAppContext.presets.hasOwnProperty(props.presetName)) {
                  NotificationContext.warning(
                    getTranslation(
                      "presetOnlineBtn.presetSameNameExist",
                      "You already have a preset with the same name"
                    )
                  );
                  return;
                }
                if (!isPresetValid(props.preset)) {
                  const presetInvalidOrObsoleteMessage = getTranslation(
                    "presetOnlineBtn.presetInvalidOrObsolete",
                    'Preset "{presetName}" is invalid or obsolete',
                    { presetName: props.presetName }
                  );
                  NotificationContext.error(presetInvalidOrObsoleteMessage);
                  return;
                }
                ryzenControllerAppContext.addPreset(props.presetName, props.preset);
                const presetDownloadedMessage = getTranslation(
                  "presetOnlineBtn.presetDownloaded",
                  'Preset "{presetName}" has been downloaded',
                  { presetName: props.presetName }
                );
                NotificationContext.talk(presetDownloadedMessage);
                return;
              }}
            >
              {getTranslation("presetOnlineBtn.download", "Download")}
            </button>
            <button
              className="uk-button uk-button-small uk-button-default"
              uk-tooltip={`title: ${getTranslation(
                "presetOnlineBtn.loadTooltip",
                "Without saving the preset, it will be loaded in RyzenAdj's tabs but not applied."
              )}`}
              onClick={() => {
                ryzenControllerAppContext.updateCurrentSettings(props.preset);
                const presetloadedMessage = getTranslation(
                  "presetOnlineBtn.presetDownloaded",
                  'Preset "{presetName}" has been loaded',
                  { presetName: props.presetName }
                );
                NotificationContext.talk(presetloadedMessage);
              }}
            >
              {getTranslation("presetOnlineBtn.load", "Load")}
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
