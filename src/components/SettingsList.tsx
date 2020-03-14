import * as React from "react";
import RyzenControllerAppContext, {
  RyzenControllerSettingsDefinitions,
  getSettingDefinition,
} from "../contexts/RyzenControllerAppContext";
import SettingForm from "./SettingForm";

class SettingsList extends React.PureComponent {
  state = {
    settings: {},
  };

  render() {
    const platform: "win32" | "linux" = window.require("os").platform();
    return (
      <form className="uk-margin-left uk-margin-right">
        <RyzenControllerAppContext.Consumer>
          {(ryzenControllerAppContext: RyzenControllerAppContextType) => (
            <fieldset className="uk-fieldset">
              {Object.keys(RyzenControllerSettingsDefinitions).map(
                (key: string): React.ReactNode => {
                  // @ts-ignore
                  const settingKey: RyzenControllerSettingsNames = key;
                  if (!RyzenControllerSettingsDefinitions[settingKey].compatibility[platform]) {
                    return null;
                  }
                  return (
                    <div key={settingKey}>
                      <SettingForm
                        setting={RyzenControllerSettingsDefinitions[settingKey]}
                        value={ryzenControllerAppContext.settings[settingKey]}
                        onChange={this.updateSetting(ryzenControllerAppContext, settingKey)}
                      />
                    </div>
                  );
                }
              )}
            </fieldset>
          )}
        </RyzenControllerAppContext.Consumer>
      </form>
    );
  }

  updateSetting(
    ryzenControllerAppContext: RyzenControllerAppContextType,
    settingKey: RyzenControllerSettingsNames
  ): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return function(e: React.ChangeEvent<HTMLInputElement>): void {
      const def = getSettingDefinition(settingKey);
      if (!def) {
        return;
      }
      const value = def.type === "boolean" ? e.target.checked : e.target.value;
      ryzenControllerAppContext.updateSettings({
        [settingKey]: value,
      });
    };
  }
}

export default SettingsList;
