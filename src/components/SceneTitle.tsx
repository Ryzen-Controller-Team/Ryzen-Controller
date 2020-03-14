import * as React from "react";

function SceneTitle(props: { title: string; className?: string }) {
  return <h2 className={`uk-margin uk-margin-left uk-margin-right ${props.className}`}>{props.title}</h2>;
}

export default SceneTitle;
