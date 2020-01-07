import * as React from "react";
import LightModeContext from "../contexts/LightModeContext";

type CardProps = {
  title: string;
  children: React.ReactNode;
  type?: "small" | "normal";
};

function Card(props: CardProps) {
  const type = props.type || "normal";

  return (
    <LightModeContext.Consumer>
      {lm => {
        const defaultClasses =
          "uk-margin-top uk-margin-small-right uk-margin-small-left uk-card uk-card-default uk-card-body";
        const lightClasses = lm.mode === "light" ? "uk-dark uk-background-default" : "uk-light uk-background-primary";
        const typeClasses = type === "normal" ? "" : "uk-padding-small";
        return (
          <div className={`${defaultClasses} ${lightClasses} ${typeClasses}`}>
            <h3 className="uk-text-nowrap uk-card-title">{props.title}</h3>
            <div>{props.children}</div>
          </div>
        );
      }}
    </LightModeContext.Consumer>
  );
}

export default Card;
