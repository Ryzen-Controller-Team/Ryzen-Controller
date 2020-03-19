import * as React from "react";
import Card from "./Card";
import RyzenControllerAppContext from "../contexts/RyzenControllerAppContext";
import { getTranslation } from "../contexts/LocaleContext";

const whenLaptopPluggedInTitle = getTranslation("presetAutoApply.whenLaptopPluggedIn", "When laptop plugged in");
const nonePresetMessage = getTranslation("presetAutoApply.nonePreset", "None");
const whenLaptopPluggedOutTitle = getTranslation("presetAutoApply.whenLaptopPluggedOut", "When laptop plugged out");
const whenSessionResumeTitle = getTranslation("presetAutoApply.whenSessionResume", "When session resume");
const whenRCStartTitle = getTranslation("presetAutoApply.whenRCStart", "When Ryzen Controller starts");

class PresetAutoApplyCards extends React.PureComponent {
  updateOnLaptopPluggedIn(ryzenControllerAppContext: RyzenControllerAppContextType) {
    return function(event: React.ChangeEvent<HTMLSelectElement>): void {
      ryzenControllerAppContext.updateSettings({
        onLaptopPluggedIn: event.target.value,
      });
    };
  }
  updateOnLaptopPluggedOut(ryzenControllerAppContext: RyzenControllerAppContextType) {
    return function(event: React.ChangeEvent<HTMLSelectElement>): void {
      ryzenControllerAppContext.updateSettings({
        onLaptopPluggedOut: event.target.value,
      });
    };
  }

  updateOnRCStart(ryzenControllerAppContext: RyzenControllerAppContextType) {
    return function(event: React.ChangeEvent<HTMLSelectElement>): void {
      ryzenControllerAppContext.updateSettings({
        onRCStart: event.target.value,
      });
    };
  }

  updateOnSessionResume(ryzenControllerAppContext: RyzenControllerAppContextType) {
    return function(event: React.ChangeEvent<HTMLSelectElement>): void {
      ryzenControllerAppContext.updateSettings({
        onSessionResume: event.target.value,
      });
    };
  }

  render() {
    return (
      <RyzenControllerAppContext.Consumer>
        {ryzenControllerAppContext => {
          const presetNames = Object.keys(ryzenControllerAppContext.presets);
          return (
            <div className="uk-flex uk-flex-wrap">
              {window.require("os").platform() === "win32" ? (
                <React.Fragment>
                  <Card title={whenLaptopPluggedInTitle} type="small">
                    <select
                      onChange={this.updateOnLaptopPluggedIn(ryzenControllerAppContext)}
                      className="uk-select"
                      value={ryzenControllerAppContext.settings.onLaptopPluggedIn || ""}
                    >
                      <option value="">{nonePresetMessage}</option>
                      {presetNames.map(presetName => {
                        return (
                          <option key={`1_${presetName}`} value={presetName}>
                            {presetName}
                          </option>
                        );
                      })}
                    </select>
                  </Card>
                  <Card title={whenLaptopPluggedOutTitle} type="small">
                    <select
                      onChange={this.updateOnLaptopPluggedOut(ryzenControllerAppContext)}
                      className="uk-select"
                      value={ryzenControllerAppContext.settings.onLaptopPluggedOut || ""}
                    >
                      <option value="">{nonePresetMessage}</option>
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
              <Card title={whenSessionResumeTitle} type="small">
                <select
                  onChange={this.updateOnSessionResume(ryzenControllerAppContext)}
                  className="uk-select"
                  value={ryzenControllerAppContext.settings.onSessionResume || ""}
                >
                  <option value="">{nonePresetMessage}</option>
                  {presetNames.map(presetName => {
                    return (
                      <option key={`2_${presetName}`} value={presetName}>
                        {presetName}
                      </option>
                    );
                  })}
                </select>
              </Card>
              <Card title={whenRCStartTitle} type="small">
                <select
                  onChange={this.updateOnRCStart(ryzenControllerAppContext)}
                  className="uk-select"
                  value={ryzenControllerAppContext.settings.onRCStart || ""}
                >
                  <option value="">{nonePresetMessage}</option>
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
          );
        }}
      </RyzenControllerAppContext.Consumer>
    );
  }
}

export default PresetAutoApplyCards;
