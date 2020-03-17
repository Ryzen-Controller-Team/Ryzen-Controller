import { createContext } from "react";
import AppVersion from "./AppVersion";

const lightModeSettingsKey = `${AppVersion.string}.lightMode`;

const LightModeContext = createContext({
  mode: "light",
  switch: (): void => {},
});
LightModeContext.displayName = "LightModeContext";

export { lightModeSettingsKey };
export default LightModeContext;
