import * as React from "react";
import logo from "../assets/icon.png";
import Badge from "./Badge";
import LightModeContext from "../contexts/LightModeContext";
import { getTranslation } from "../contexts/LocaleContext";

function TopBar() {
  return (
    <header>
      <div
        style={{
          width: "128px",
          height: "128px",
          display: "inline-block",
        }}
      >
        <img src={logo} alt="Ryzen Controller" style={{ padding: "10px" }} />
      </div>
      <Badge
        className="uk-margin-left"
        value={process.env.REACT_APP_VERSION || "dev"}
        onClick={openExternal("https://gitlab.com/ryzen-controller-team/ryzen-controller/releases")}
        background="#EE0000"
      />
      <Badge
        className="uk-margin-left"
        value={getTranslation("topbar.beer", "Buy us some beers ❤️")}
        onClick={openExternal("https://www.patreon.com/ryzencontrollerteam")}
        background="#888888"
      />
      <Badge
        className="uk-margin-left"
        value={getTranslation("topbar.discord", "Join us on discord")}
        onClick={openExternal("https://discord.gg/EahayUv")}
        background="#7289da"
      />
      <LightModeContext.Consumer>
        {mode => (
          <Badge
            className="uk-margin-left"
            value={mode.mode === "dark" ? "☀️" : "🌙"}
            onClick={mode.switch}
            background={mode.mode === "dark" ? "#FFF" : "#000"}
          />
        )}
      </LightModeContext.Consumer>
      <Badge
        className="uk-margin-left"
        value="🇧🇱"
        onClick={() => {
          require("uikit")
            .modal(document.getElementById("locale-selector-modal"))
            .show();
        }}
        background="rgba(0, 0, 0, 0)"
      />
    </header>
  );
}

/**
 * This method open the given URL using external browser.
 * @param url The URL to be opened.
 * @return function
 */
function openExternal(url: string) {
  return function openExternalNow() {
    window.require("electron").remote.shell.openExternal(url);
  };
}

export default TopBar;
