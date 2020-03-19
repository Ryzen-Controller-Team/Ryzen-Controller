import * as React from "react";
import LightModeContext from "../contexts/LightModeContext";
import { getTranslation } from "../contexts/LocaleContext";

const youDontHaveAnyText = getTranslation("presetListEmpty.youDontHaveAny", "You don't have any preset yet");
const sentencePart1Text = getTranslation("presetListEmpty.sentencePart1", "You can create one by using the");
const createPresetBtnText = getTranslation("presetListEmpty.createPresetBtn", "Create preset");
const sentencePart2Text = getTranslation(
  "presetListEmpty.sentencePart2",
  "button available on Ryzen Adj settings tabs (CPU, GPU, ...)."
);

function PresetListEmpty() {
  return (
    <LightModeContext.Consumer>
      {lm => {
        const classes = lm.mode === "light" ? "uk-dark uk-background-default" : "uk-light uk-background-primary";
        return (
          <div className={`uk-flex uk-flex-center uk-margin-left uk-margin-right`}>
            <div className={`uk-card uk-card-default uk-card-body uk-width-1-2@m ${classes}`}>
              <h3 className="uk-card-title">{youDontHaveAnyText}</h3>
              <p>
                {sentencePart1Text}
                <button className="uk-button uk-button-default uk-margin-small-left uk-margin-small-right">
                  {createPresetBtnText}
                </button>
                {sentencePart2Text}
              </p>
            </div>
          </div>
        );
      }}
    </LightModeContext.Consumer>
  );
}

export default PresetListEmpty;
