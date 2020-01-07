import * as React from "react";
import RyzenControllerAppContext from "../contexts/RyzenControllerAppContext";
import PresetListEmpty from "../components/PresetListEmpty";
import PresetLine from "../components/PresetLine";
import SceneTitle from "../components/SceneTitle";
import Card from "../components/Card";

function PresetsScene() {
  return (
    <RyzenControllerAppContext.Consumer>
      {(ryzenControllerAppContext: RyzenControllerAppContextType) => {
        if (Object.entries(ryzenControllerAppContext.presets).length <= 0) {
          return <PresetListEmpty />;
        }

        const presetNames = Object.keys(ryzenControllerAppContext.presets);
        return (
          <React.Fragment>
            <SceneTitle title="Presets available" />
            <ul className="uk-margin uk-list uk-list-large uk-list-striped">
              {presetNames.map(presetName => {
                const preset = ryzenControllerAppContext.presets[presetName];
                return <PresetLine key={`0_${presetName}`} presetName={presetName} preset={preset} />;
              })}
            </ul>
            <SceneTitle title="Auto apply preset" />
            <div className="uk-flex uk-flex-wrap">
              {window.require("os").platform() === "win32" ? (
                <React.Fragment>
                  <Card title="When laptop plugged in" type="small">
                    <select
                      onChange={updateOnLaptopPluggedIn(ryzenControllerAppContext)}
                      className="uk-select"
                      value={ryzenControllerAppContext.settings.onLaptopPluggedIn || ""}
                    >
                      <option value="">None</option>
                      {presetNames.map(presetName => {
                        return (
                          <option key={`1_${presetName}`} value={presetName}>
                            {presetName}
                          </option>
                        );
                      })}
                    </select>
                  </Card>
                  <Card title="When laptop plugged out" type="small">
                    <select
                      onChange={updateOnLaptopPluggedOut(ryzenControllerAppContext)}
                      className="uk-select"
                      value={ryzenControllerAppContext.settings.onLaptopPluggedOut || ""}
                    >
                      <option value="">None</option>
                      {presetNames.map(presetName => {
                        return (
                          <option key={`2_${presetName}`} value={presetName}>
                            {presetName}
                          </option>
                        );
                      })}
                    </select>
                  </Card>
                </React.Fragment>
              ) : null}
              <Card title="When session resume" type="small">
                <select
                  onChange={updateOnSessionResume(ryzenControllerAppContext)}
                  className="uk-select"
                  value={ryzenControllerAppContext.settings.onSessionResume || ""}
                >
                  <option value="">None</option>
                  {presetNames.map(presetName => {
                    return (
                      <option key={`2_${presetName}`} value={presetName}>
                        {presetName}
                      </option>
                    );
                  })}
                </select>
              </Card>
              <Card title="When Ryzen Controller starts" type="small">
                <select
                  onChange={updateOnRCStart(ryzenControllerAppContext)}
                  className="uk-select"
                  value={ryzenControllerAppContext.settings.onRCStart || ""}
                >
                  <option value="">None</option>
                  {presetNames.map(presetName => {
                    return (
                      <option key={`2_${presetName}`} value={presetName}>
                        {presetName}
                      </option>
                    );
                  })}
                </select>
              </Card>
            </div>
          </React.Fragment>
        );
      }}
    </RyzenControllerAppContext.Consumer>
  );
}

function updateOnLaptopPluggedIn(ryzenControllerAppContext: RyzenControllerAppContextType) {
  return function(event: React.ChangeEvent<HTMLSelectElement>): void {
    ryzenControllerAppContext.updateSettings({
      onLaptopPluggedIn: event.target.value,
    });
  };
}
function updateOnLaptopPluggedOut(ryzenControllerAppContext: RyzenControllerAppContextType) {
  return function(event: React.ChangeEvent<HTMLSelectElement>): void {
    ryzenControllerAppContext.updateSettings({
      onLaptopPluggedOut: event.target.value,
    });
  };
}

function updateOnRCStart(ryzenControllerAppContext: RyzenControllerAppContextType) {
  return function(event: React.ChangeEvent<HTMLSelectElement>): void {
    ryzenControllerAppContext.updateSettings({
      onRCStart: event.target.value,
    });
  };
}

function updateOnSessionResume(ryzenControllerAppContext: RyzenControllerAppContextType) {
  return function(event: React.ChangeEvent<HTMLSelectElement>): void {
    ryzenControllerAppContext.updateSettings({
      onSessionResume: event.target.value,
    });
  };
}

export default PresetsScene;
