import NotificationContext from "./NotificationContext";
import { getRyzenAdjExecutablePath } from "./RyzenControllerAppContext";
import { getTranslation } from "./LocaleContext";

const RyzenAdjOptionDefinitions: Array<RyzenAdjOptionDefinition> = [
  {
    description: getTranslation(
      "ryzenAdj.psi0Current.desc",
      "The limit of current we let the motherboard deliver to the PSI0."
    ),
    label: getTranslation("ryzenAdj.psi0Current.label", "PSI0 Current Limit (mA)"),
    tab: "power",
    min: 20,
    max: 100,
    step: 1,
    default: 20,
    ryzenadj_arg: "--psi0-current=",
    ryzenadj_value_convert: "toHex",
  },
  {
    description: getTranslation(
      "ryzenAdj.vrmmaxCurrent.desc",
      "The limit of current we let the motherboard deliver to the CPU."
    ),
    label: getTranslation("ryzenAdj.vrmmaxCurrent.label", "VRM Current (A)"),
    tab: "power",
    min: 20,
    max: 90,
    step: 1,
    default: 30,
    ryzenadj_arg: "--vrmmax-current=",
    ryzenadj_value_convert: "toThousand",
  },
  {
    description: getTranslation(
      "ryzenAdj.minGfxclk.desc",
      "The minimum clock speed the integrated (Vega) GPU is allowed to run at."
    ),
    label: getTranslation("ryzenAdj.minGfxclk.label", "Minimum Vega iGPU Clock Frequency (Mhz)"),
    tab: "gpu",
    min: 400,
    max: 1300,
    step: 1,
    default: 400,
    ryzenadj_arg: "--min-gfxclk=",
    ryzenadj_value_convert: "roundTen",
  },
  {
    description: getTranslation(
      "ryzenAdj.maxGfxclk.desc",
      "The maximum clock speed the integrated (Vega) GPU is allowed to run at."
    ),
    label: getTranslation("ryzenAdj.maxGfxclk.label", "Maximum Vega iGPU Clock Frequency (Mhz)"),
    tab: "gpu",
    min: 400,
    max: 1300,
    step: 1,
    default: 1100,
    ryzenadj_arg: "--max-gfxclk=",
    ryzenadj_value_convert: "roundTen",
  },
  {
    description: getTranslation(
      "ryzenAdj.minFclkFrequency.desc",
      "Infinity Fabric is AMD's marketing term for the bus connection that connects processor dies (GPU/CPU). This define the bus's min. clock limit."
    ),
    label: getTranslation("ryzenAdj.minFclkFrequency.label", "Minimum Infinity Fabric frequency (Mhz)"),
    tab: "gpu",
    min: 800,
    max: 1900,
    step: 1,
    default: 800,
    ryzenadj_arg: "--min-fclk-frequency=",
    ryzenadj_value_convert: null,
  },
  {
    description: getTranslation(
      "ryzenAdj.maxFclkFrequency.desc",
      "Infinity Fabric is AMD's marketing term for the bus connection that connects processor dies (GPU/CPU). This define the bus's max. clock limit."
    ),
    label: getTranslation("ryzenAdj.maxFclkFrequency.label", "Maximum Infinity Fabric frequency (Mhz)"),
    tab: "gpu",
    min: 800,
    max: 1900,
    step: 1,
    default: 1200,
    ryzenadj_arg: "--max-fclk-frequency=",
    ryzenadj_value_convert: null,
  },
  {
    description: getTranslation("ryzenAdj.tctlTemp.desc", "The temperature the CPU can reach before boost levels off."),
    label: getTranslation("ryzenAdj.tctlTemp.label", "Temperature Limit (°C)"),
    tab: "cpu",
    min: 50,
    max: 110,
    step: 1,
    default: 75,
    ryzenadj_arg: "--tctl-temp=",
    ryzenadj_value_convert: null,
  },
  {
    description: getTranslation(
      "ryzenAdj.stapmLimit.desc",
      "Skin Temperature Aware Power Management. This will define the socket power package limit which is used to manage the device boost period."
    ),
    label: getTranslation("ryzenAdj.stapmLimit.label", "CPU TDP (W)"),
    tab: "cpu",
    min: 5,
    max: 100,
    step: 1,
    default: 20,
    ryzenadj_arg: "--stapm-limit=",
    ryzenadj_value_convert: "toThousand",
  },
  
  {
    description: getTranslation(
      "ryzenAdj.stapmTime.desc",
      "Skin Temperature Aware Power Management. This will define the boost period to be used."
    ),
    label: getTranslation("ryzenAdj.stapmTime.label", "Long Boost Duration"),
    tab: "cpu",
    min: 1,
    max: 3600,
    step: 1,
    default: 900,
    ryzenadj_arg: "--stapm-time=",
    ryzenadj_value_convert: null,
  },
  {
    description: getTranslation(
      "ryzenAdj.fastLimit.desc",
      "The amount of power the CPU can draw while boost levels on."
    ),
    label: getTranslation("ryzenAdj.fastLimit.label", "Long Boost TDP (W)"),
    tab: "cpu",
    min: 5,
    max: 100,
    step: 1,
    default: 25,
    ryzenadj_arg: "--fast-limit=",
    ryzenadj_value_convert: "toThousand",
  },
  {
    description: getTranslation(
      "ryzenAdj.slowLimit.desc",
      "The amount of power the CPU can draw while boost levels off."
    ),
    {
    description: getTranslation(
      "ryzenAdj.slowTime.desc",
      "This define the period to be used out of boost period to deliver a constant power to be delivered to the socket."
    ),
    label: getTranslation("ryzenAdj.slowTime.label", "Short Boost Duration "),
    tab: "cpu",
    min: 1,
    max: 3600,
    step: 1,
    default: 900,
    ryzenadj_arg: "--slow-time=",
    ryzenadj_value_convert: null,
  },
    label: getTranslation("ryzenAdj.slowLimit.label", "Sort Boost TDP (W)"),
    tab: "cpu",
    min: 5,
    max: 100,
    step: 1,
    default: 10,
    ryzenadj_arg: "--slow-limit=",
    ryzenadj_value_convert: "toThousand",
  },
];

const valueConverter = function(converterName: RyzenAdjConverter, value: number): string {
  switch (converterName) {
    case "toHex":
      if (value < 0) {
        value = 0xffffffff + value * 1000 + 1;
      }
      return "0x" + value.toString(16).toUpperCase();

    case "roundTen":
      return `${Math.round((value / 10) * 10)}`;

    case "toThousand":
      return `${value * 1000}`;

    case null:
      return `${value}`;

    default:
      return "";
  }
};

const getOptionDefinition = function(name: RyzenAdjArguments): RyzenAdjOptionDefinition {
  return RyzenAdjOptionDefinitions.filter(definition => {
    return definition.ryzenadj_arg === name;
  })[0];
};

const createRyzenAdjCommandLine = function(preset: RyzenAdjOptionListType): Array<string> {
  let commandLine: Array<string> = [];
  for (const key in preset) {
    if (!preset.hasOwnProperty(key)) {
      continue;
    }
    // @ts-ignore
    const arg: RyzenAdjArguments = key;
    const optionValue = preset[arg];
    if (!optionValue.enabled) {
      continue;
    }
    commandLine.push(`${arg}${valueConverter(getOptionDefinition(arg).ryzenadj_value_convert, optionValue.value)}`);
  }
  return commandLine;
};

const ryzenAdjProcess = function(parameters: Array<string>): Promise<string> {
  return new Promise((res, rej) => {
    const child = window.require("child_process").execFile;
    const executablePath = getRyzenAdjExecutablePath();

    if (parameters.length === 0) {
      NotificationContext.warning(
        getTranslation("ryzenAdj.pleaseAddSomeOptions", "Please add some options before applying ryzenAdj.")
      );
      return;
    }

    console.log(`${executablePath} ${parameters.join(" ")}`);

    child(executablePath, parameters, function(err: string, data: Buffer) {
      var output = data?.toString();
      if (err) {
        rej(err);
      } else if (output) {
        res(output);
      }
      res("no output");
    });
  });
};

const executeRyzenAdj = function(parameters: Array<string>, notification: boolean = true, retry = 3) {
  if (retry === 0) {
    NotificationContext.error(getTranslation("ryzenAdj.unableToApply", "Unable to apply ryzenadj"), "ryzenadj_applied");
    return;
  }

  if (parameters.length === 0) {
    NotificationContext.warning(
      getTranslation("ryzenAdj.pleaseAddSomeOptions", "Please add some options before applying ryzenAdj.")
    );
    return;
  }

  ryzenAdjProcess(parameters)
    .then((output: string) => {
      if (notification) {
        NotificationContext.success(
          getTranslation("ryzenAdj.applySuccess", "RyzenAdj has been executed successfully."),
          "ryzenadj_applied"
        );
        console.log(output);
      }
    })
    .catch(err => {
      executeRyzenAdj(parameters, notification, retry - 1);
      console.error(err);
    });
};

export { RyzenAdjOptionDefinitions, getOptionDefinition, executeRyzenAdj, createRyzenAdjCommandLine };
