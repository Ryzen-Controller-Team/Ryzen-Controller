import * as React from "react";
import logo from "../assets/icon.png";
import Badge from "./Badge";
import LightModeContext from "../contexts/LightModeContext";
import { getTranslation } from "../contexts/LocaleContext";
import AppVersion from "../contexts/AppVersion";

const beerText = getTranslation("topbar.beer", "Buy us some beers ❤️");
const discordText = getTranslation("topbar.discord", "Ask for help");

function TopBar() {
  return (
    <header className="app-header">
      <div
        style={{
          width: "96px",
          height: "96px",
          display: "inline-block",
        }}
      >
        <img src={logo} alt="Ryzen Controller" style={{ padding: "10px" }} />
      </div>
      <Badge
        className="uk-margin-left badge"
        value={AppVersion.semver}
        onClick={openExternal("https://gitlab.com/ryzen-controller-team/ryzen-controller/releases")}
        background="#EE0000"
      />
      <Badge
        className="uk-margin-left badge"
        value={beerText}
        onClick={openExternal("https://www.patreon.com/ryzencontrollerteam")}
        background="#888888"
      />
      <Badge
        className="uk-margin-left badge"
        value={discordText}
        onClick={openExternal("https://discord.gg/8E7TxQmqv2")}
        background="#888888"
      />
      <LightModeContext.Consumer>
        {mode => (
          <Badge
            className="uk-margin-left badge"
            value={mode.mode === "dark" ? "🌙 Dark" : "☀️ Light"}
            onClick={mode.switch}
            background={mode.mode === "dark" ? "#888888" : "#888888"}
          />
        )}
      </LightModeContext.Consumer>
      <Badge
        className="uk-margin-left badge"
        value="🌐 Language"
        onClick={() => {
          require("uikit")
            .modal(document.getElementById("locale-selector-modal"))
            .show();
        }}
        background="#888888"
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
