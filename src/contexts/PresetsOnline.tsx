import { createContext } from "react";

let context: PresetsOnlineContextType = {
  error: false,
  loading: true,
  list: [],
  update() {},
  uploadPreset(preset) {
    return new Promise(res => {
      res();
    });
  },
  upvote() {
    return new Promise(res => {
      res();
    });
  },
  downvote() {
    return new Promise(res => {
      res();
    });
  },
};

const PresetsOnlineContext = createContext(context);
PresetsOnlineContext.displayName = "PresetsOnlineContext";

export default PresetsOnlineContext;
