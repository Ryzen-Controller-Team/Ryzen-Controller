import * as React from "react";
import SysInfoCards from "../components/SysInfoCards";
import SceneTitle from "../components/SceneTitle";
import SettingsList from "../components/SettingsList";
import SysInfoContext from "../contexts/SysInfoContext";
import { getTranslation } from "../contexts/LocaleContext";

const settingsTitleText = getTranslation("SettingsScene.settingsTitle", "Settings");
const sysInfoTitleText = getTranslation("SettingsScene.sysInfoTitle", "System Info");
const loadingSysHashText = getTranslation("SettingsScene.loadingSysHash", "Loading...");
const systemHashDescText = getTranslation(
  "SettingsScene.systemHashDesc",
  "This will be used to ensure downloaded presets compatibility."
);

class SettingsScene extends React.PureComponent<{}, {}> {
  render() {
    return (
      <React.Fragment>
        <SceneTitle title={settingsTitleText} />
        <SettingsList />
        <SceneTitle title={sysInfoTitleText} className="uk-margin-remove-bottom" />
        <SysInfoCards />
        <SysInfoContext.Consumer>
          {sysInfoContext => (
            <p
              className="uk-text-small uk-text-italic uk-margin-left uk-margin-remove-bottom"
              uk-tooltip={`pos: top-left; title: ${systemHashDescText}`}
            >
              System hash:{" "}
              {sysInfoContext.signature && sysInfoContext.permissiveSignature
                ? `${sysInfoContext.signature} || ${sysInfoContext.permissiveSignature}`
                : loadingSysHashText}
            </p>
          )}
        </SysInfoContext.Consumer>
      </React.Fragment>
    );
  }
}

export default SettingsScene;
