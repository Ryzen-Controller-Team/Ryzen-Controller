import * as React from "react";
import TopBar from "./components/TopBar";
import SceneSelector from "./components/SceneSelector";
import Scene from "./scenes/Scene";
import { HashRouter as Router } from "react-router-dom";
import SysInfoContext, {
  createMachineSignature,
  SysInfoState,
  createPermissiveMachineSignature,
} from "./contexts/SysInfoContext";
import LightModeContext, { lightModeSettingsKey } from "./contexts/LightModeContext";
import { checkNewVersion } from "./contexts/RyzenControllerAppContext";
import LocaleContext, { localeSettingsKey } from "./contexts/LocaleContext";
import LocaleSelectorModal from "./components/LocaleSelectorModal";
const si = window.require("systeminformation");
const electronSettings = window.require("electron-settings");

type AppState = {
  sysinfo: SysInfoState;
  lightMode: {
    mode: "light" | "dark";
    switch(): void;
  };
  locale: {
    is: AvailableLanguages;
    change(to: AvailableLanguages): void;
  };
};

class App extends React.Component<{}, AppState> {
  _isMounted = false;

  _defaultSysinfo: SysInfoState = {
    cpu: false,
    graphics: false,
    mem: false,
    memLayout: false,
    system: false,
    bios: false,
    signature: false,
    permissiveSignature: false,
  };

  state = {
    sysinfo: this._defaultSysinfo,
    lightMode: {
      mode: this.getLatestLightMode(),
      switch: this.switchLightMode.bind(this),
    },
    locale: {
      is: this.getLatestLocale(),
      change: this.changeLocale.bind(this),
    },
  };

  switchLightMode(): void {
    let lightMode = electronSettings.get(lightModeSettingsKey) || "light";
    lightMode = lightMode === "light" ? "dark" : "light";
    electronSettings.set(lightModeSettingsKey, lightMode);
    this.setState({
      lightMode: {
        mode: lightMode,
        switch: this.switchLightMode.bind(this),
      },
    });
  }

  changeLocale(to: AvailableLanguages): void {
    electronSettings.set(localeSettingsKey, to);
    window.location.reload();
  }

  getLatestLightMode(): "light" | "dark" {
    return electronSettings.get(lightModeSettingsKey) || "light";
  }

  getLatestLocale(): AvailableLanguages {
    return electronSettings.get(localeSettingsKey) || "en";
  }

  componentDidMount() {
    this._isMounted = true;
    si.getAllData()
      .then((data: SysInfoState) => {
        data.signature = createMachineSignature(data);
        data.permissiveSignature = createPermissiveMachineSignature(data);
        if (this._isMounted) this.setState({ sysinfo: data });
      })
      .catch((error: string) => {
        if (this._isMounted) {
          this.setState({
            sysinfo: {
              ...this.state.sysinfo,
              error: error,
            },
          });
        }
      });

    checkNewVersion();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const classes =
      this.state.lightMode.mode === "light" ? "uk-dark uk-background-default" : "uk-light uk-background-secondary";
    const body = window.document.getElementsByTagName("body").item(0);
    if (body) {
      body.className = classes;
    }

    return (
      <div className={classes}>
        <LocaleContext.Provider value={this.state.locale}>
          <SysInfoContext.Provider value={this.state.sysinfo}>
            <LightModeContext.Provider value={this.state.lightMode}>
              <Router>
                <div className="uk-card uk-margin-bottom">
                  <TopBar />
                  <SceneSelector />
                </div>
                <Scene />
              </Router>
            </LightModeContext.Provider>
          </SysInfoContext.Provider>
          <LocaleSelectorModal />
        </LocaleContext.Provider>
      </div>
    );
  }
}

export default App;
