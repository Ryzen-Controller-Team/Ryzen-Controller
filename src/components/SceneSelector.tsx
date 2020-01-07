import * as React from "react";
import { Link, Switch, Route } from "react-router-dom";
import LightModeContext from "../contexts/LightModeContext";

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
                      <Tabs tabName="CPU" tabLocation="/cpu" currentLocation={currentLocation} />
                      <Tabs tabName="GPU" tabLocation="/gpu" currentLocation={currentLocation} />
                      <Tabs tabName="Power" tabLocation="/power" currentLocation={currentLocation} />
                      <Tabs tabName="Presets" tabLocation="/presets" currentLocation={currentLocation} />
                      <Tabs tabName="Settings" tabLocation="/settings" currentLocation={currentLocation} />
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

export default SceneSelector;
