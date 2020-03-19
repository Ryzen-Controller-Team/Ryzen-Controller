import * as React from "react";
import { getTranslation } from "../contexts/LocaleContext";

const currentPathText = getTranslation("settingForm.currentPath", "Current path:");
const browseBtnText = getTranslation("settingForm.browseBtn", "Browse");
const windowsBinFileTypeText = getTranslation("settingForm.windowsBinFileType", "Windows Binary");

type ElectronFileDialogType = {
  filePaths?: Array<string>;
};

type SettingFormProps = {
  setting: RyzenControllerSettingDefinition;
  value: boolean | string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

class SettingForm extends React.PureComponent<SettingFormProps> {
  render(): React.ReactNode {
    return (
      <div uk-tooltip={this.props.setting.description || ""} className="uk-form-controls uk-form-controls-text">
        {this.props.setting.displayTitle ? <h4 className="uk-margin-top">{this.props.setting.name}</h4> : null}
        <label className="uk-form-label uk-pointer">
          {this.renderType(this.props.setting.type)} {this.props.setting.short_description}
        </label>
      </div>
    );
  }

  renderType(type: "boolean" | "range" | "path"): React.ReactNode {
    switch (type) {
      case "boolean":
        const checked = !!this.props.value;
        return <input onChange={this.props.onChange} checked={checked} className="uk-checkbox" type="checkbox" />;

      case "range":
        const number = parseInt(`${this.props.value}`) || 0;
        return (
          <div className="uk-inline uk-margin-small-right">
            <input
              onChange={this.props.onChange}
              defaultValue={number}
              className="uk-input uk-form-width-small"
              type="number"
            />
          </div>
        );

      case "path":
        const path = `${this.props.value}`;
        return (
          <React.Fragment>
            <p className="uk-margin-small-bottom">
              {currentPathText} <code>{path || "default"}</code>
            </p>
            <button onClick={this.findFile.bind(this)} className="uk-button uk-button-default">
              {browseBtnText}
            </button>
          </React.Fragment>
        );

      default:
        throw new Error("Unknown setting type.");
    }
  }

  findFile(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    const allowedFiles =
      window.require("electron").remote.process.platform === "linux"
        ? []
        : [
            {
              name: windowsBinFileTypeText,
              extensions: ["exe"],
            },
          ];
    window
      .require("electron")
      .remote.dialog.showOpenDialog({
        properties: ["onpenFile"],
        filters: allowedFiles,
      })
      .then((data: ElectronFileDialogType) => {
        if (!data.filePaths) {
          return;
        }
        // @ts-ignore
        this.props.onChange({ target: { value: data.filePaths[0] } });
      });
  }
}

export default SettingForm;
