import * as React from "react";
import RyzenAdjOptionList from "../components/RyzenAdjOptionList";
import RyzenAdjBottomBar from "../components/RyzenAdjBottomBar";

function RyzenAdjScene(props: { filter: RyzenControllerTabForRyzenAdj }) {
  return (
    <div className="uk-container uk-container-expend">
      <RyzenAdjOptionList filter={props.filter} />
      <RyzenAdjBottomBar />
    </div>
  );
}

export default RyzenAdjScene;
