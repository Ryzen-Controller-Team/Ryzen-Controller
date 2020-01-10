import * as React from "react";
import RyzenControllerAppContext from "../contexts/RyzenControllerAppContext";
import PresetListEmpty from "../components/PresetListEmpty";
import PresetLine from "../components/PresetLine";
import SceneTitle from "../components/SceneTitle";
import PresetAutoApplyCards from "../components/PresetAutoApplyCards";
import PresetOnline from "../components/PresetOnline";
import NotificationContext from "../contexts/NotificationContext";
import PresetsOnlineContext from "../contexts/PresetsOnline";
const uikit = window.require("uikit");

class PresetsScene extends React.Component<{}, PresetsOnlineContextType> {
  _isMounted = false;
  state: PresetsOnlineContextType = {
    loading: false,
    list: [],
    update: this.updatePresetList.bind(this),
    uploadPreset: this.uploadPreset.bind(this),
    upvote: this.upvote.bind(this),
    downvote: this.downvote.bind(this),
  };

  __constructor() {
    this.updatePresetList = this.updatePresetList.bind(this);
    this.uploadPreset = this.uploadPreset.bind(this);
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.vote = this.vote.bind(this);
    this.retainVotedPreset = this.retainVotedPreset.bind(this);
    this.isUserAlreadyVotedForThisPreset = this.isUserAlreadyVotedForThisPreset.bind(this);
  }

  uploadPreset(preset: ApiPreset) {
    const requestOption: RequestInit = {
      method: "POST",
      headers: {
        accept: "application/ld+json",
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify(preset),
    };

    return fetch("http://api.ryzencontroller.com/presets", requestOption)
      .then(response => response.json())
      .then((data: ApiPreset | any) => {
        if (data?.violations?.length) {
          data.violations.map((violation: any) => {
            NotificationContext.error(`${violation.pathProperty}: ${violation.message}`);
            return false;
          });
          throw new Error("Violation detected while POST request to API.");
        }
        if (data?.id) {
          // @ts-ignore
          let newSavedPreset: ApiPreset = data;
          return newSavedPreset;
        }
        throw new Error("Unable to upload the preset.");
      });
  }

  updatePresetList() {
    this.setState({ loading: true });
    const requestOption: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    fetch("http://api.ryzencontroller.com/presets", requestOption)
      .then(response => response.json())
      .then((data: Array<ApiPreset>) => {
        if (this._isMounted) this.setState({ list: data, loading: false });
      });
  }

  downvote(presetId: number): Promise<ApiPreset> {
    if (this.isUserAlreadyVotedForThisPreset(presetId)) {
      NotificationContext.warning(`You can't vote twice for the same preset`);
      return new Promise((res, rej) => {
        rej(`You can't vote twice for the same preset`);
      });
    }
    return uikit.modal.confirm("Are you sure to downvote this preset?").then(() => {
      return this.vote(presetId, "down");
    });
  }

  upvote(presetId: number): Promise<ApiPreset> {
    if (this.isUserAlreadyVotedForThisPreset(presetId)) {
      NotificationContext.warning(`You can't vote twice for the same preset`);
      return new Promise((res, rej) => {
        rej(`You can't vote twice for the same preset`);
      });
    }
    return uikit.modal.confirm("Are you sure to upvote this preset?").then(() => {
      return this.vote(presetId, "up");
    });
  }

  vote(presetId: number, action: "up" | "down"): Promise<ApiPreset> {
    const url = `http://api.ryzencontroller.com/presets/${presetId}`;
    const requestOptionGet: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const requestOptionPatch: RequestInit = {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "Content-Type": "application/merge-patch+json",
      },
    };
    NotificationContext.talk("Updating votes ...");
    return fetch(url, requestOptionGet)
      .then(response => response.json())
      .then((data: ApiPreset) => {
        const presetField = `${action}vote`;
        const value = action === "up" ? data.upvote + 1 : data.downvote - 1;
        const newPresetValue: Partial<ApiPreset> = {
          [presetField]: value,
        };
        return fetch(url, {
          ...requestOptionPatch,
          body: JSON.stringify(newPresetValue),
        })
          .then(response => response.json())
          .then((data: ApiPreset) => {
            this.retainVotedPreset(presetId);
            this.updatePresetList();
            return data;
          });
      })
      .catch(error => {
        NotificationContext.error(`Error while sending vote`);
        throw new Error(error);
      });
  }

  isUserAlreadyVotedForThisPreset(presetId: number): boolean {
    const votedPresets: Array<number> = window.require("electron-settings").get("votedPresets");
    if (!votedPresets) {
      return false;
    }
    return votedPresets.indexOf(presetId) !== -1;
  }

  retainVotedPreset(presetId: number): void {
    let votedPresets = window.require("electron-settings").get("votedPresets");
    if (!votedPresets) {
      votedPresets = [];
    }
    votedPresets.push(presetId);
    window.require("electron-settings").set("votedPresets", votedPresets);
  }

  componentDidMount() {
    this._isMounted = true;
    this.updatePresetList();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <PresetsOnlineContext.Provider value={this.state}>
        <RyzenControllerAppContext.Consumer>
          {(ryzenControllerAppContext: RyzenControllerAppContextType) => {
            if (Object.entries(ryzenControllerAppContext.presets).length <= 0) {
              return (
                <React.Fragment>
                  <PresetListEmpty />
                  <SceneTitle title="Online Presets" />
                  <PresetOnline />
                </React.Fragment>
              );
            }

            const presetNames = Object.keys(ryzenControllerAppContext.presets);
            return (
              <React.Fragment>
                <SceneTitle title="Local Presets" />
                <ul className="uk-margin uk-list uk-list-large uk-list-striped">
                  {presetNames.map(presetName => {
                    const preset = ryzenControllerAppContext.presets[presetName];
                    return <PresetLine key={`0_${presetName}`} presetName={presetName} preset={preset} />;
                  })}
                </ul>
                <SceneTitle title="Online Presets" />
                <PresetOnline />
                <SceneTitle title="Auto apply preset" />
                <PresetAutoApplyCards />
              </React.Fragment>
            );
          }}
        </RyzenControllerAppContext.Consumer>
      </PresetsOnlineContext.Provider>
    );
  }
}

export default PresetsScene;
