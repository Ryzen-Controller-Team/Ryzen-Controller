import { createContext } from "react";

const LightModeContext = createContext({
  mode: "light",
  switch: (): void => {},
});
LightModeContext.displayName = "LightModeContext";

export default LightModeContext;
