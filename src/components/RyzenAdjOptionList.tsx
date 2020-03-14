import * as React from "react";
import RyzenAdjOptions from "../components/RyzenAdjOptions";
import RyzenAdjOptionForm from "../components/RyzenAdjOptionForm";
import RyzenAdjOptionLabel from "../components/RyzenAdjOptionLabel";

type RyzenAdjOptionListProps = {
  filter: RyzenControllerTabForRyzenAdj;
};

class RyzenAdjOptionList extends React.PureComponent<RyzenAdjOptionListProps, {}> {
  render() {
    return <RyzenAdjOptions tab={this.props.filter} render={this.renderRyzenAdjOptionFormList.bind(this)} />;
  }

  renderRyzenAdjOptionFormList(options: Array<RyzenAdjOptionDefinition>): React.ReactNode {
    return (
      <React.Fragment>
        {options.map((option: RyzenAdjOptionDefinition) => {
          return (
            <div key={option.ryzenadj_arg} className="uk-margin">
              <RyzenAdjOptionLabel option={option} />
              <RyzenAdjOptionForm enabled={true} option={option} />
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default RyzenAdjOptionList;
