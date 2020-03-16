import * as React from "react";
import PresetsOnlineContext from "../contexts/PresetsOnline";
import Card from "./Card";
import SysInfoContext, { SysInfoState } from "../contexts/SysInfoContext";
import PresetOnlineLine from "../components/PresetOnlineLine";
import { isPresetValid } from "../contexts/RyzenControllerAppContext";
import { getTranslation } from "../contexts/LocaleContext";

function PresetOnline() {
  return (
    <SysInfoContext.Consumer>
      {(sysInfoContext: SysInfoState) => (
        <PresetsOnlineContext.Consumer>
          {(presetsOnlineContext: PresetsOnlineContextType) => {
            return presetsOnlineContext.list
              .filter(preset => isPresetValid(preset.ryzenAdjArguments))
              .filter(preset => preset.systemHash === sysInfoContext.signature).length && sysInfoContext?.signature ? (
              <ul className="uk-margin uk-list uk-list-large uk-list-striped">
                {presetsOnlineContext.list
                  .filter(preset => isPresetValid(preset.ryzenAdjArguments))
                  .filter(preset => preset.systemHash === sysInfoContext.signature)
                  .map((preset: ApiPreset, index) => {
                    const presetName = preset.name;
                    return <PresetOnlineLine preset={preset} key={`online_${index}_${presetName}_btn`} />;
                  })}
              </ul>
            ) : presetsOnlineContext.error && !presetsOnlineContext.loading ? (
              <Card title={getTranslation("PresetOnline.errorLoadingPresets", "Unable to load presets.")}>
                {getTranslation("PresetOnline.pleaseCheckInternetConnection", "Please check your internet connection.")}
                <br />
                <button
                  className="uk-margin-small-bottom uk-button uk-button-small uk-button-default"
                  onClick={() => presetsOnlineContext.update()}
                >
                  {getTranslation("PresetOnline.retryLoadingPresetListBtn", "Retry")}
                </button>
              </Card>
            ) : presetsOnlineContext.loading || !sysInfoContext?.signature ? (
              <div className="uk-flex uk-flex-center">
                <div uk-spinner="ratio: 2"></div>
              </div>
            ) : (
              <Card
                title={getTranslation(
                  "PresetOnline.listNotLoadedYet",
                  "List hasn't been loaded or there is no online preset yet."
                )}
              >
                <button
                  className="uk-margin-small-bottom uk-button uk-button-small uk-button-default"
                  onClick={() => presetsOnlineContext.update()}
                >
                  {getTranslation("PresetOnline.loadPresetListBtn", "Load preset list")}
                </button>
                <br />
                {getTranslation("PresetOnline.sentencePart1", "You can share your own preset by clicking on the")}
                <button
                  className="uk-margin-small-right uk-margin-small-left uk-button uk-button-small uk-button-default"
                  onClick={() => false}
                >
                  {getTranslation("PresetOnline.uploadBtn", "Upload")}
                </button>
                {getTranslation("PresetOnline.sentencePart2", "button available on your presets.")}
              </Card>
            );
          }}
        </PresetsOnlineContext.Consumer>
      )}
    </SysInfoContext.Consumer>
  );
}

export default PresetOnline;
