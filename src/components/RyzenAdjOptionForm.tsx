import * as React from "react";
import RyzenControllerAppContext from "../contexts/RyzenControllerAppContext";

type RyzenAdjOptionFormState = {
  value: number;
};

type RyzenAdjOptionFormProps = {
  option: RyzenAdjOptionDefinition;
  enabled: boolean;
};

class RyzenAdjOptionForm extends React.PureComponent<RyzenAdjOptionFormProps, RyzenAdjOptionFormState> {
  state = {
    value: this.props.option.default,
  };

  render() {
    const onChange = this.onChange.bind(this);
    if (!this.props.enabled) return null;

    return (
      <RyzenControllerAppContext.Consumer>
        {ryzenControllerAppContext => {
          const isEnabled = ryzenControllerAppContext.currentSettings[this.props.option.ryzenadj_arg]?.enabled;
          const value =
            ryzenControllerAppContext.currentSettings[this.props.option.ryzenadj_arg].value || this.state.value;
          if (!isEnabled) {
            return null;
          }

          return (
            <div className="uk-grid-small" uk-grid="">
              <div className="uk-width-1-6">
                <input
                  onChange={onChange(ryzenControllerAppContext).bind(this)}
                  className="uk-input"
                  type="number"
                  value={value}
                  min={this.props.option.min}
                  max={this.props.option.max}
                  step={this.props.option.step}
                />
              </div>
              <div className="uk-width-5-6">
                <input
                  onChange={onChange(ryzenControllerAppContext).bind(this)}
                  className="uk-range"
                  type="range"
                  value={value}
                  min={this.props.option.min}
                  max={this.props.option.max}
                  step={this.props.option.step}
                />
              </div>
            </div>
          );
        }}
      </RyzenControllerAppContext.Consumer>
    );
  }

  onChange(ryzenControllerAppContext: RyzenControllerAppContextType) {
    const name: RyzenAdjArguments = this.props.option.ryzenadj_arg;
    const _this = this;
    return function(event: React.ChangeEvent<HTMLInputElement>): void {
      let value = parseInt(event.target.value);
      if (value < _this.props.option.min) {
        value = _this.props.option.min;
      }
      if (value > _this.props.option.max) {
        value = _this.props.option.max;
      }
      ryzenControllerAppContext.updateCurrentSettings({
        [name]: {
          enabled: true,
          value: value,
        },
      });
    };
  }
}

export default RyzenAdjOptionForm;
