import * as React from "react";
import { Link, Switch, Route } from "react-router-dom";
import LightModeContext from "../contexts/LightModeContext";
import { getTranslation } from "../contexts/LocaleContext";

function Tabs(props: { tabName: string; tabLocation: string; currentLocation: string }) {
  let isActive = "";
  if (props.currentLocation === props.tabLocation) {
    isActive = "uk-active";
  }

  return (
    <li className={isActive}>
      <Link to={props.tabLocation}>{props.tabName}</Link>
    </li>
  );
}

function SceneSelector() {
  return (
    <LightModeContext.Consumer>
      {lm => {
        const classes = lm.mode === "light" ? "uk-dark uk-background-default" : "uk-light uk-background-secondary";
        return (
          <nav className={classes} uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
            <Switch>
              <Route
                render={props => {
                  const currentLocation = props.location.pathname;

                  return (
                    <ul className="uk-tab uk-margin-remove-bottom">
                      <Tabs
                        tabName={getTranslation("sceneSelector.cpuTitle", "CPU")}
                        tabLocation="/cpu"
                        currentLocation={currentLocation}
                      />
                      <Tabs
                        tabName={getTranslation("sceneSelector.gpuTitle", "GPU")}
                        tabLocation="/gpu"
                        currentLocation={currentLocation}
                      />
                      <Tabs
                        tabName={getTranslation("sceneSelector.powerTitle", "Power")}
                        tabLocation="/power"
                        currentLocation={currentLocation}
                      />
                      <Tabs
                        tabName={getTranslation("sceneSelector.presetsTitle", "Presets")}
                        tabLocation="/presets"
                        currentLocation={currentLocation}
                      />
                      <Tabs
                        tabName={getTranslation("sceneSelector.settingsTitle", "Settings")}
                        tabLocation="/settings"
                        currentLocation={currentLocation}
                      />
                      <li>
                        <a
                          href="https://gitlab.com/ryzen-controller-team/ryzen-controller/-/releases"
                          onClick={openExternal("https://gitlab.com/ryzen-controller-team/ryzen-controller/-/releases")}
                        >
                          <span uk-icon="link"></span>
                          {getTranslation("sceneSelector.releasesTitle", "Releases")}
                        </a>
                      </li>
                    </ul>
                  );
                }}
              ></Route>
            </Switch>
          </nav>
        );
      }}
    </LightModeContext.Consumer>
  );
}

/**
 * This method open the given URL using external browser.
 * @param url The URL to be opened.
 * @return function
 */
function openExternal(url: string) {
  return function openExternalNow(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.require("electron").remote.shell.openExternal(url);
    return false;
  };
}

export default SceneSelector;
