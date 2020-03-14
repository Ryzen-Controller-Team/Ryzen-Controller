import * as React from "react";
import SysInfoCards from "../components/SysInfoCards";
import SceneTitle from "../components/SceneTitle";
import SettingsList from "../components/SettingsList";
import SysInfoContext from "../contexts/SysInfoContext";
import { getTranslation } from "../contexts/LocaleContext";

class SettingsScene extends React.PureComponent<{}, {}> {
  render() {
    return (
      <React.Fragment>
        <SceneTitle title={getTranslation("SettingsScene.settingsTitle", "Settings")} />
        <SettingsList />
        <SceneTitle
          title={getTranslation("SettingsScene.sysInfoTitle", "System Info")}
          className="uk-margin-remove-bottom"
        />
        <SysInfoCards />
        <SysInfoContext.Consumer>
          {sysInfoContext => (
            <p
              className="uk-text-small uk-text-italic uk-margin-left uk-margin-remove-bottom"
              uk-tooltip={`pos: top-left; title: ${getTranslation(
                "SettingsScene.systemHashDesc",
                "This will be used to ensure downloaded presets compatibility."
              )}`}
            >
              System hash: {sysInfoContext.signature || getTranslation("SettingsScene.loadingSysHash", "Loading...")}
            </p>
          )}
        </SysInfoContext.Consumer>
      </React.Fragment>
    );
  }
}

export default SettingsScene;
