import * as React from "react";
import { RyzenAdjOptionDefinitions } from "../contexts/RyzenAdjContext";

type RyzenAdjOptionsProps = {
  tab?: RyzenControllerTabForRyzenAdj;
  render(options: Array<RyzenAdjOptionDefinition>): React.ReactNode;
};

function RyzenAdjOptions(props: RyzenAdjOptionsProps) {
  let currentTabs: Array<RyzenAdjOptionDefinition> = RyzenAdjOptionDefinitions;
  if (props.tab) {
    currentTabs = RyzenAdjOptionDefinitions.filter(option => option.tab === props.tab);
  }

  return <React.Fragment>{props.render(currentTabs)}</React.Fragment>;
}

export default RyzenAdjOptions;
export { RyzenAdjOptionDefinitions };
