import * as React from "react";
import PresetsOnlineContext from "../contexts/PresetsOnline";
import Card from "./Card";
import SysInfoContext, { SysInfoState } from "../contexts/SysInfoContext";
import PresetOnlineLine from "../components/PresetOnlineLine";

function PresetOnline() {
  return (
    <SysInfoContext.Consumer>
      {(sysInfoContext: SysInfoState) => (
        <PresetsOnlineContext.Consumer>
          {(presetsOnlineContext: PresetsOnlineContextType) => {
            return presetsOnlineContext.list.filter(preset => preset.systemHash === sysInfoContext.signature).length &&
              sysInfoContext?.signature ? (
              <ul className="uk-margin uk-list uk-list-large uk-list-striped">
                {presetsOnlineContext.list
                  .filter(preset => preset.systemHash === sysInfoContext.signature)
                  .map((preset: ApiPreset, index) => {
                    const presetName = preset.name;
                    return <PresetOnlineLine preset={preset} key={`online_${index}_${presetName}_btn`} />;
                  })}
              </ul>
            ) : presetsOnlineContext.loading || !sysInfoContext?.signature ? (
              <div className="uk-flex uk-flex-center">
                <div uk-spinner="ratio: 2"></div>
              </div>
            ) : (
              <Card title="List hasn't been loaded or there is no online preset yet.">
                <button
                  className="uk-margin-small-bottom uk-button uk-button-small uk-button-default"
                  onClick={() => presetsOnlineContext.update()}
                >
                  Load preset list
                </button>
                <br />
                You can share your own preset by clicking on the
                <button
                  className="uk-margin-small-right uk-margin-small-left uk-button uk-button-small uk-button-default"
                  onClick={() => false}
                >
                  Upload
                </button>
                button available on your presets.
              </Card>
            );
          }}
        </PresetsOnlineContext.Consumer>
      )}
    </SysInfoContext.Consumer>
  );
}

export default PresetOnline;
