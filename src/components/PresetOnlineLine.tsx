import * as React from "react";
import PresetSummary from "../components/PresetSummary";
import PresetOnlineButtons from "../components/PresetOnlineButtons";

type PresetOnlineLineProps = {
  preset: ApiPreset;
};

class PresetOnlineLine extends React.PureComponent<PresetOnlineLineProps, {}> {
  render() {
    return (
      <li className="uk-position-relative">
        <div className="uk-grid">
          <div className="uk-width-1-1 uk-width-1-2@s uk-width-2-3@l uk-width-3-4@xl">
            {this.props.preset.name}
            <PresetSummary preset={this.props.preset.ryzenAdjArguments} />
          </div>
          <div className="uk-width-1-1 uk-width-1-2@s uk-width-1-3@l uk-width-1-4@xl">
            <PresetOnlineButtons
              presetId={this.props.preset.id}
              presetName={this.props.preset.name}
              preset={this.props.preset.ryzenAdjArguments}
              upvote={this.props.preset.upvote}
              downvote={this.props.preset.downvote}
            />
          </div>
        </div>
      </li>
    );
  }
}

export default PresetOnlineLine;
