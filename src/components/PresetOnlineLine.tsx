import * as React from "react";
import PresetSummary from "../components/PresetSummary";
import PresetOnlineButtons from "../components/PresetOnlineButtons";
import SysInfoContext, { SysInfoState } from "../contexts/SysInfoContext";
import { getTranslation } from "../contexts/LocaleContext";

const compatSentence = getTranslation("presetLine.compatibility", "Compatibility level:");

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
          <SysInfoContext.Consumer>
            {(sysInfo: SysInfoState) => {
              var compatLevel = 1;
              if (sysInfo.permissiveSignature === this.props.preset.permissiveSystemHash) {
                compatLevel = 2;
              }
              if (sysInfo.signature === this.props.preset.systemHash) {
                compatLevel = 3;
              }
              return (
                <div className="uk-width-1-1">
                  {compatSentence} {compatLevel}/3
                </div>
              );
            }}
          </SysInfoContext.Consumer>
        </div>
      </li>
    );
  }
}

export default PresetOnlineLine;
