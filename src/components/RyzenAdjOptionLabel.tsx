import * as React from "react";
import RyzenControllerAppContext from "../contexts/RyzenControllerAppContext";

type RyzenAdjOptionLabelProps = {
  option: RyzenAdjOptionDefinition;
};

type RyzenAdjOptionLabelState = {
  enabled: boolean;
};

class RyzenAdjOptionLabel extends React.PureComponent<RyzenAdjOptionLabelProps, RyzenAdjOptionLabelState> {
  state = {
    enabled: false,
  };

  isEnabled(ryzenControllerAppContext: RyzenControllerAppContextType): boolean {
    const isEnabled: boolean =
      ryzenControllerAppContext.currentSettings[this.props.option.ryzenadj_arg]?.enabled || false;
    if (this.state.enabled !== isEnabled) {
      this.setState({
        enabled: isEnabled,
      });
    }
    return isEnabled;
  }

  render() {
    return (
      <RyzenControllerAppContext.Consumer>
        {ryzenControllerAppContext => (
          <div className="uk-grid-small" uk-grid="">
            <div className="uk-width-expend">
              <h2>
                <label className="uk-pointer">
                  <input
                    className="uk-margin-right uk-checkbox"
                    type="checkbox"
                    checked={this.isEnabled(ryzenControllerAppContext)}
                    onChange={this.handleChange(ryzenControllerAppContext).bind(this)}
                  />
                  {this.props.option.label}
                </label>
                <span
                  uk-icon="info"
                  className="uk-margin-left"
                  uk-tooltip={`title: ${this.props.option.description}`}
                />
              </h2>
            </div>
          </div>
        )}
      </RyzenControllerAppContext.Consumer>
    );
  }

  handleChange(ryzenControllerAppContext: RyzenControllerAppContextType): Function {
    return (event: React.ChangeEvent<HTMLInputElement>): void => {
      this.setState({
        enabled: event.target.checked,
      });
      let newCurrentSettings: PartialRyzenAdjOptionListType = {
        [this.props.option.ryzenadj_arg]: {
          enabled: event.target.checked,
          value: ryzenControllerAppContext.currentSettings[this.props.option.ryzenadj_arg].value,
        },
      };
      ryzenControllerAppContext.updateCurrentSettings(newCurrentSettings);
    };
  }
}

export default RyzenAdjOptionLabel;
