import * as React from "react";
import PresetSummary from "../components/PresetSummary";
import PresetButtons from "../components/PresetButtons";

type PresetLineProps = {
  presetName: string;
  preset: RyzenAdjOptionListType;
};

class PresetLine extends React.PureComponent<PresetLineProps, {}> {
  render() {
    return (
      <li className="uk-position-relative">
        <div className="uk-grid">
          <div className="uk-width-1-1 uk-width-1-2@s uk-width-2-3@l uk-width-3-4@xl">
            {this.props.presetName}
            <PresetSummary preset={this.props.preset} />
          </div>
          <div className="uk-width-1-1 uk-width-1-2@s uk-width-1-3@l uk-width-1-4@xl">
            <PresetButtons preset={this.props.preset} presetName={this.props.presetName} />
          </div>
        </div>
      </li>
    );
  }
}

export default PresetLine;
