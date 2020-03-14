import * as React from "react";
import { createRyzenAdjCommandLine } from "../contexts/RyzenAdjContext";

function PresetSummary(props: { preset: RyzenAdjOptionListType }) {
  return (
    <p
      className="uk-text-small uk-text-truncate uk-text-italic"
      uk-tooltip={`title: ${createRyzenAdjCommandLine(props.preset).join("<br/>")}`}
    >
      {createRyzenAdjCommandLine(props.preset).join(" ")}
    </p>
  );
}

export default PresetSummary;
