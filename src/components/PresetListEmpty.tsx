import * as React from "react";
import LightModeContext from "../contexts/LightModeContext";

function PresetListEmpty() {
  return (
    <LightModeContext.Consumer>
      {lm => {
        const classes = lm.mode === "light" ? "uk-dark uk-background-default" : "uk-light uk-background-primary";
        return (
          <div className={`uk-flex uk-flex-center uk-margin-left uk-margin-right`}>
            <div className={`uk-card uk-card-default uk-card-body uk-width-1-2@m ${classes}`}>
              <h3 className="uk-card-title">You don't have any preset yet</h3>
              <p>
                You can create one by using the
                <button className="uk-button uk-button-default uk-margin-small-left uk-margin-small-right">
                  Create preset
                </button>
                button available on Ryzen Adj settings tabs (CPU, GPU, ...).
              </p>
            </div>
          </div>
        );
      }}
    </LightModeContext.Consumer>
  );
}

export default PresetListEmpty;
