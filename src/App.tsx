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
import LightModeContext from "./contexts/LightModeContext";
import { checkNewVersion } from "./contexts/RyzenControllerAppContext";
import LocaleContext, { getTranslation } from "./contexts/LocaleContext";
import LocaleSelectorModal from "./components/LocaleSelectorModal";
const si = window.require("systeminformation");

type AppState = {
  sysinfo: SysInfoState;
  lightMode: {
    mode: "light" | "dark";
    switch(): void;
  };
  locale: {
    is: AvailableLanguages;
    change(to: AvailableLanguages): void;
    getTranslation(id: string, fallback?: string, variables?: Record<string, string>): string;
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
      getTranslation: getTranslation,
    },
  };

  switchLightMode(): void {
    let lightMode = window.require("electron-settings").get("lightMode") || "light";
    lightMode = lightMode === "light" ? "dark" : "light";
    window.require("electron-settings").set("lightMode", lightMode);
    this.setState({
      lightMode: {
        mode: lightMode,
        switch: this.switchLightMode.bind(this),
      },
    });
  }

  changeLocale(to: AvailableLanguages): void {
    window.require("electron-settings").set("locale", to);
    window.location.reload();
  }

  getLatestLightMode(): "light" | "dark" {
    return window.require("electron-settings").get("lightMode") || "light";
  }

  getLatestLocale(): AvailableLanguages {
    return window.require("electron-settings").get("locale") || "en";
  }

  componentDidMount() {
    this._isMounted = true;
    si.getAllData()
      .then((data: SysInfoState) => {
        data.signature = createMachineSignature(data);
        data.permissiveSignature = createPermissiveMachineSignature(data);
        this._isMounted && this.setState({ sysinfo: data });
      })
      .catch((error: string) => {
        this._isMounted &&
          this.setState({
            sysinfo: {
              ...this.state.sysinfo,
              error: error,
            },
          });
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
