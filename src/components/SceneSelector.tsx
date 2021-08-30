import * as React from "react";
import { Link, Switch, Route } from "react-router-dom";
import LightModeContext from "../contexts/LightModeContext";
import { getTranslation } from "../contexts/LocaleContext";

const cpuTitleText = getTranslation("sceneSelector.cpuTitle", "CPU");
const gpuTitleText = getTranslation("sceneSelector.gpuTitle", "GPU");
const powerTitleText = getTranslation("sceneSelector.powerTitle", "Power");
const statusTitleText = getTranslation("sceneSelector.statusTitle", "Status");
const presetsTitleText = getTranslation("sceneSelector.presetsTitle", "Presets");
const settingsTitleText = getTranslation("sceneSelector.settingsTitle", "Settings");
const releasesTitleText = getTranslation("sceneSelector.releasesTitle", "Releases");

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
                      <Tabs tabName={cpuTitleText} tabLocation="/cpu" currentLocation={currentLocation} />
                      <Tabs tabName={gpuTitleText} tabLocation="/gpu" currentLocation={currentLocation} />
                      <Tabs tabName={powerTitleText} tabLocation="/power" currentLocation={currentLocation} />
                      <Tabs tabName={statusTitleText} tabLocation="/status" currentLocation={currentLocation} />
                      <Tabs tabName={presetsTitleText} tabLocation="/presets" currentLocation={currentLocation} />
                      <Tabs tabName={settingsTitleText} tabLocation="/settings" currentLocation={currentLocation} />
                      <li>
                        <a
                          href="https://gitlab.com/ryzen-controller-team/ryzen-controller/-/releases"
                          onClick={openExternal("https://gitlab.com/ryzen-controller-team/ryzen-controller/-/releases")}
                        >
                          <span uk-icon="link"></span>
                          {releasesTitleText}
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
