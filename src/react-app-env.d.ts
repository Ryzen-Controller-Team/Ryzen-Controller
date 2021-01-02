/// <reference types="react-scripts" />

/* Add language here */
type AvailableLanguages = "en" | "fr" | "ch" | "de" | "tr" | "ko";

type RyzenControllerTabForRyzenAdj = "power" | "cpu" | "gpu";

type RyzenAdjArguments =
  | "--slow-time="
  | "--psi0-current="
  | "--vrmmax-current="
  | "--min-gfxclk="
  | "--max-gfxclk="
  | "--min-fclk-frequency="
  | "--max-fclk-frequency="
  | "--tctl-temp="
  | "--stapm-limit="
  | "--stapm-time="
  | "--fast-limit="
  | "--slow-limit=";

type RyzenAdjConverter = "toHex" | "roundTen" | "toThousand" | null;

type RyzenAdjOptionDefinition = {
  description: string;
  label: string;
  tab: RyzenControllerTabForRyzenAdj;
  min: number;
  max: number;
  step: number;
  default: number;
  ryzenadj_arg: RyzenAdjArguments;
  ryzenadj_value_convert: RyzenAdjConverter;
};

type RyzenAdjOptionValue = {
  enabled: boolean;
  value: number;
};

type RyzenAdjOptionListType = { [args in RyzenAdjArguments]: RyzenAdjOptionValue };
type RyzenAdjOptionListNamedType = { [name: string]: RyzenAdjOptionListType };

type PartialRyzenAdjOptionListType = { [args in RyzenAdjArguments]?: RyzenAdjOptionValue };
type PartialRyzenAdjOptionListNamedType = {
  [name: string]: PartialRyzenAdjOptionListType;
};

type RyzenAdjOptionContextType = {
  update(name: RyzenAdjArguments, value: Partial<RyzenAdjOptionValue>): void;
  list: PartialRyzenAdjOptionListType;
};

type RyzenControllerSettingsNames =
  | "autoStartOnBoot"
  | "minimizeOnLaunch"
  | "minimizeToTray"
  | "reApplyPeriodically"
  | "ryzenAdjPath"
  | "onLaptopPluggedIn"
  | "onLaptopPluggedOut"
  | "onRCStart"
  | "onSessionResume";

type RyzenControllerSettings = {
  autoStartOnBoot: boolean;
  minimizeOnLaunch: boolean;
  minimizeToTray: boolean;
  reApplyPeriodically: number | false;
  ryzenAdjPath: string;
  onLaptopPluggedIn: string | false;
  onLaptopPluggedOut: string | false;
  onRCStart: string | false;
  onSessionResume: string | false;
};

type RyzenControllerSettingDefinition = {
  displayTitle: boolean;
  name: string;
  short_description: string;
  description?: string;
  type: "boolean" | "range" | "path";
  default: boolean | number | string;
  compatibility: {
    win32: boolean;
    linux: boolean;
  };
  apply(value: boolean | number | string): Promise<string | boolean>;
};

type RyzenControllerSettingDefinitionList = {
  [args in RyzenControllerSettingsNames]: RyzenControllerSettingDefinition;
};

type RyzenControllerAppContextType = {
  latestSettings: RyzenAdjOptionListType;
  currentSettings: RyzenAdjOptionListType;
  presets: RyzenAdjOptionListNamedType;
  settings: RyzenControllerSettings;
  updateLatestSettings(): void;
  updateCurrentSettings(list: PartialRyzenAdjOptionListType): void;
  addPreset(name: string, preset: PartialRyzenAdjOptionListType): void;
  removePreset(name: keyof RyzenAdjOptionListNamedType): void;
  updateSettings(settings: Partial<RyzenControllerSettings>): void;
};

type ApiPreset = {
  id: number;
  systemHash: string;
  permissiveSystemHash: string;
  upvote: number;
  downvote: number;
  name: string;
  ryzenAdjArguments: RyzenAdjOptionListType;
};

type PresetsOnlineContextType = {
  error: boolean;
  loading: boolean;
  list: Array<ApiPreset>;
  update(): void;
  uploadPreset(preset: Partial<ApiPreset>): Promise<ApiPreset>;
  upvote(presetId: number): Promise<ApiPreset>;
  downvote(presetId: number): Promise<ApiPreset>;
};
