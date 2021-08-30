import * as React from "react";
import GaugeChart from "react-gauge-chart";
import { ryzenAdjProcess } from "../contexts/RyzenAdjContext";
import { getTranslation } from "../contexts/LocaleContext";
import LightModeContext from "../contexts/LightModeContext";
import { appContextSettingsKey, RyzenControllerSettingsDefinitions } from "../contexts/RyzenControllerAppContext";
const electronSettings = window.require("electron-settings");

const i18n = {
  noData: getTranslation("statusScene.noData", "No data to show"),
  thmValueCore: getTranslation("statusScene.thmValueCore", "Core Temperature"),
  pptValueApu: getTranslation("statusScene.pptValueApu", "Package Power Consumption"),
  showRawData: getTranslation("statusScene.showRawData", "Show raw data"),
  tableParameter: getTranslation("statusScene.tableParameter", "Parameter"),
  tableValue: getTranslation("statusScene.tableValue", "Current value"),
  tableMaxValue: getTranslation("statusScene.tableMaxValue", "Max. value"),
};

class PresetsScene extends React.Component {
  _isMounted = false;
  data: { [key: string]: number } = {};
  allData = false;
  __constructor() {}
  async componentDidMount() {
    this._isMounted = true;
    this.parseData(await ryzenAdjProcess(["-i"]));
    let intervalDuration =
      electronSettings.get(appContextSettingsKey)?.settings.statusUpdateInterval ||
      RyzenControllerSettingsDefinitions["statusUpdateInterval"].default;
    intervalDuration = Math.max(500, intervalDuration);
    const interval = setInterval(async () => {
      if (!this._isMounted) {
        clearInterval(interval);
        return;
      }
      this.parseData(await ryzenAdjProcess(["-i"]));
    }, intervalDuration as number);
  }
  parseData(output: string) {
    output
      .split("\n")
      .slice(2)
      .forEach(line => {
        const parts = line.split("|");
        if (parts.length === 5) {
          const value = parseFloat(parts[2].trim());
          // smooth values on readout to prevent jumping of gauges
          if (this.data[parts[1].trim()]) {
            this.data[parts[1].trim()] += (value - this.data[parts[1].trim()]) * 0.8;
          } else {
            this.data[parts[1].trim()] = value;
          }
        }
      });
    this.setState({ data: this.data });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (Object.keys(this.data).length === 0) {
      return <h2 className="uk-flex uk-flex-center">{i18n.noData}</h2>;
    }
    return (
      <LightModeContext.Consumer>
        {lightModeContext => {
          return (
            <div className="uk-flex uk-flex-column uk-padding-large">
              <div className="uk-flex uk-flex-center uk-flex-around uk-padding-large">
                <div className="uk-flex uk-flex-column uk-flex-middle uk-box-shadow-small uk-padding-small">
                  <GaugeChart
                    id="gauge-temp-current"
                    textColor={lightModeContext.mode === "light" ? "#000" : "#fff"}
                    nrOfLevels={10}
                    percent={(this.data["THM VALUE CORE"] || 0) / this.data["THM LIMIT CORE"] - 0.2}
                    formatTextValue={v => Math.round(this.data["THM VALUE CORE"]) + " °c"}
                  />
                  <label className="uk-label">{i18n.thmValueCore}</label>
                </div>
                {this.data["PPT VALUE APU"] ? (
                  <div className="uk-flex uk-flex-column uk-flex-middle uk-box-shadow-medium uk-padding-small">
                    <GaugeChart
                      id="gauge-tdp-current"
                      textColor={lightModeContext.mode === "light" ? "#000" : "#fff"}
                      nrOfLevels={10}
                      percent={(this.data["PPT VALUE APU"] || 0) / this.data["PPT LIMIT APU"]}
                      formatTextValue={v => Math.round(this.data["PPT VALUE APU"] * 10) / 10 + " w"}
                    />
                    <label className="uk-label">{i18n.pptValueApu}</label>
                  </div>
                ) : null}
              </div>
              <div className="uk-flex uk-flex-center uk-margin-top">
                <button
                  className="uk-button uk-button-default uk-flex uk-flex-middle"
                  onClick={() => {
                    this.allData = !this.allData;
                    this.setState({ allData: this.allData });
                  }}
                >
                  <span>{i18n.showRawData}</span>
                  <span uk-icon={this.allData ? "chevron-up" : "chevron-down"} className="uk-margin-small-left" />
                </button>
              </div>
              {this.allData ? this.renderRawData() : null}
            </div>
          );
        }}
      </LightModeContext.Consumer>
    );
  }
  renderRawData() {
    return (
      <div className="uk-container uk-container-xlarge">
        <table className="uk-table">
          <thead>
            <tr>
              <th>{i18n.tableParameter}</th>
              <th>{i18n.tableValue}</th>
              <th>{i18n.tableMaxValue}</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.data)
              .filter(f => f.includes("VALUE"))
              .map(element => {
                return (
                  <tr>
                    <td>{element}</td>
                    <td>{Math.round(this.data[element] * 100) / 100}</td>
                    <td>{Math.round(this.data[element.replace("VALUE", "LIMIT")] * 100) / 100}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PresetsScene;
