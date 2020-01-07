import * as React from "react";
import SysInfoCards from "../components/SysInfoCards";
import SceneTitle from "../components/SceneTitle";
import SettingsList from "../components/SettingsList";
import SysInfoContext from "../contexts/SysInfoContext";

class SettingsScene extends React.PureComponent<{}, {}> {
  render() {
    return (
      <React.Fragment>
        <SceneTitle title="Settings" />
        <SettingsList />
        <SceneTitle title="System Info" className="uk-margin-remove-bottom" />
        <SysInfoCards />
        <SysInfoContext.Consumer>
          {sysInfoContext => (
            <p
              className="uk-text-small uk-text-italic uk-margin-left uk-margin-remove-bottom"
              uk-tooltip="pos: top-left; title: This will be used to ensure downloaded presets compatibility."
            >
              System hash: {sysInfoContext.signature || "Loading ..."}
            </p>
          )}
        </SysInfoContext.Consumer>
      </React.Fragment>
    );
  }
}

export default SettingsScene;
