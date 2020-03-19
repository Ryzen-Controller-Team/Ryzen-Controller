import * as React from "react";
import RyzenControllerAppContext from "../contexts/RyzenControllerAppContext";
import PresetListEmpty from "../components/PresetListEmpty";
import PresetLine from "../components/PresetLine";
import SceneTitle from "../components/SceneTitle";
import PresetAutoApplyCards from "../components/PresetAutoApplyCards";
import PresetOnline from "../components/PresetOnline";
import NotificationContext from "../contexts/NotificationContext";
import PresetsOnlineContext from "../contexts/PresetsOnline";
import { getTranslation, variablesInTranslation } from "../contexts/LocaleContext";
import AppVersion from "../contexts/AppVersion";
const uikit = window.require("uikit");
const electronSettings = window.require("electron-settings");

const votedPresetsSettingsKey = `${AppVersion.string}.votedPresets`;
const confirmVoteText = getTranslation("PresetsScene.confirmVote", "Are you sure to {vote} this preset?");
const errorWhileSendingVoteText = getTranslation("PresetsScene.errorWhileSendingVote", "Error while sending vote");
const onlinePresetTitleText = getTranslation("PresetsScene.onlinePresetTitle", "Online Presets");
const localPresetTitleText = getTranslation("PresetsScene.localPresetTitle", "Local Presets");
const autoApplyTitleText = getTranslation("PresetsScene.autoApplyTitle", "Auto apply preset");
const updatingVotesText = getTranslation("PresetsScene.updatingVotes", "Updating votes...");
const cantVoteTwiceSamePresetText = getTranslation(
  "PresetsScene.cantVoteTwiceSamePreset",
  "You can't vote twice for the same preset"
);

class PresetsScene extends React.Component<{}, PresetsOnlineContextType> {
  _isMounted = false;
  state: PresetsOnlineContextType = {
    error: false,
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

  uploadPreset(preset: ApiPreset): Promise<ApiPreset> {
    const requestOption: RequestInit = {
      method: "POST",
      headers: {
        accept: "application/ld+json",
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify(preset),
    };

    return fetch(process.env.REACT_APP_SERVER_ENDPOINT + "/presets", requestOption)
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
    function confirmDataPrototype(data: any): data is Array<ApiPreset> {
      if (typeof data?.filter === "function") {
        return true;
      }
      return false;
    }
    this.setState({ loading: true });
    const requestOption: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    fetch(process.env.REACT_APP_SERVER_ENDPOINT + "/presets", requestOption)
      .then(response => response.json())
      .then(data => {
        if (!confirmDataPrototype(data)) {
          throw new Error("Preset list from API is malformed.");
        }
        if (this._isMounted) this.setState({ list: data, loading: false, error: false });
      })
      .catch(reason => {
        if (this._isMounted) this.setState({ list: [], error: true, loading: false });
        return [];
      });
  }

  downvote(presetId: number): Promise<ApiPreset> {
    const confirmVoteTextVariable = variablesInTranslation(confirmVoteText, {
      vote: "👎",
    });
    if (this.isUserAlreadyVotedForThisPreset(presetId)) {
      NotificationContext.warning(cantVoteTwiceSamePresetText);
      return new Promise((res, rej) => {
        rej(cantVoteTwiceSamePresetText);
      });
    }
    return uikit.modal.confirm(confirmVoteTextVariable).then(() => {
      return this.vote(presetId, "down");
    });
  }

  upvote(presetId: number): Promise<ApiPreset> {
    const confirmVoteTextVariable = variablesInTranslation(confirmVoteText, {
      vote: "👍",
    });
    if (this.isUserAlreadyVotedForThisPreset(presetId)) {
      NotificationContext.warning(cantVoteTwiceSamePresetText);
      return new Promise((res, rej) => {
        rej(cantVoteTwiceSamePresetText);
      });
    }
    return uikit.modal.confirm(confirmVoteTextVariable).then(() => {
      return this.vote(presetId, "up");
    });
  }

  vote(presetId: number, action: "up" | "down"): Promise<ApiPreset> {
    const url = `${process.env.REACT_APP_SERVER_ENDPOINT}/presets/${presetId}`;
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
    NotificationContext.talk(updatingVotesText);
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
        NotificationContext.error(errorWhileSendingVoteText);
        throw new Error(error);
      });
  }

  isUserAlreadyVotedForThisPreset(presetId: number): boolean {
    const votedPresets: Array<number> = electronSettings.get(votedPresetsSettingsKey);
    if (!votedPresets) {
      return false;
    }
    return votedPresets.indexOf(presetId) !== -1;
  }

  retainVotedPreset(presetId: number): void {
    let votedPresets = electronSettings.get(votedPresetsSettingsKey);
    if (!votedPresets) {
      votedPresets = [];
    }
    votedPresets.push(presetId);
    electronSettings.set(votedPresetsSettingsKey, votedPresets);
  }

  componentDidMount() {
    this._isMounted = true;
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
                  <SceneTitle title={onlinePresetTitleText} />
                  <PresetOnline />
                </React.Fragment>
              );
            }

            const presetNames = Object.keys(ryzenControllerAppContext.presets);
            return (
              <React.Fragment>
                <SceneTitle title={localPresetTitleText} />
                <ul className="uk-margin uk-list uk-list-large uk-list-striped">
                  {presetNames.map(presetName => {
                    const preset = ryzenControllerAppContext.presets[presetName];
                    return <PresetLine key={`0_${presetName}`} presetName={presetName} preset={preset} />;
                  })}
                </ul>
                <SceneTitle title={onlinePresetTitleText} />
                <PresetOnline />
                <SceneTitle title={autoApplyTitleText} />
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
