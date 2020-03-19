import * as React from "react";
import PresetsOnlineContext from "../contexts/PresetsOnline";
import Card from "./Card";
import SysInfoContext, { SysInfoState } from "../contexts/SysInfoContext";
import PresetOnlineLine from "../components/PresetOnlineLine";
import { isPresetValid } from "../contexts/RyzenControllerAppContext";
import { getTranslation } from "../contexts/LocaleContext";

const errorLoadingPresetsText = getTranslation("PresetOnline.errorLoadingPresets", "Unable to load presets.");
const retryLoadingPresetListBtnText = getTranslation("PresetOnline.retryLoadingPresetListBtn", "Retry");
const loadPresetListBtnText = getTranslation("PresetOnline.loadPresetListBtn", "Load preset list");
const uploadBtnText = getTranslation("PresetOnline.uploadBtn", "Upload");
const sentencePart2Text = getTranslation("PresetOnline.sentencePart2", "button available on your presets.");
const pleaseCheckInternetConnectionText = getTranslation(
  "PresetOnline.pleaseCheckInternetConnection",
  "Please check your internet connection."
);
const listNotLoadedYetText = getTranslation(
  "PresetOnline.listNotLoadedYet",
  "List hasn't been loaded or there is no online preset yet."
);
const sentencePart1Text = getTranslation(
  "PresetOnline.sentencePart1",
  "You can share your own preset by clicking on the"
);

function PresetOnline() {
  return (
    <SysInfoContext.Consumer>
      {(sysInfoContext: SysInfoState) => (
        <PresetsOnlineContext.Consumer>
          {(presetsOnlineContext: PresetsOnlineContextType) => {
            const compatPresetList = presetsOnlineContext.list
              .filter(preset => isPresetValid(preset.ryzenAdjArguments))
              .filter(
                preset =>
                  preset.permissiveSystemHash === sysInfoContext.permissiveSignature ||
                  preset.systemHash === sysInfoContext.signature
              );

            return compatPresetList.length && sysInfoContext?.signature ? (
              <ul className="uk-margin uk-list uk-list-large uk-list-striped">
                {compatPresetList.map((preset: ApiPreset, index) => {
                  const presetName = preset.name;
                  return <PresetOnlineLine preset={preset} key={`online_${index}_${presetName}_btn`} />;
                })}
              </ul>
            ) : presetsOnlineContext.error && !presetsOnlineContext.loading ? (
              <Card title={errorLoadingPresetsText}>
                {pleaseCheckInternetConnectionText}
                <br />
                <button
                  className="uk-margin-small-bottom uk-button uk-button-small uk-button-default"
                  onClick={() => presetsOnlineContext.update()}
                >
                  {retryLoadingPresetListBtnText}
                </button>
              </Card>
            ) : presetsOnlineContext.loading || !sysInfoContext?.signature || !sysInfoContext?.permissiveSignature ? (
              <div className="uk-flex uk-flex-center">
                <div uk-spinner="ratio: 2"></div>
              </div>
            ) : (
              <Card title={listNotLoadedYetText}>
                <button
                  className="uk-margin-small-bottom uk-button uk-button-small uk-button-default"
                  onClick={() => presetsOnlineContext.update()}
                >
                  {loadPresetListBtnText}
                </button>
                <br />
                {sentencePart1Text}
                <button
                  className="uk-margin-small-right uk-margin-small-left uk-button uk-button-small uk-button-default"
                  onClick={() => false}
                >
                  {uploadBtnText}
                </button>
                {sentencePart2Text}
              </Card>
            );
          }}
        </PresetsOnlineContext.Consumer>
      )}
    </SysInfoContext.Consumer>
  );
}

export default PresetOnline;
