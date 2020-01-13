import NotificationContext from "./NotificationContext";
import { getRyzenAdjExecutablePath } from "./RyzenControllerAppContext";

const RyzenAdjOptionDefinitions: Array<RyzenAdjOptionDefinition> = [
  {
    description:
      "This define the period to be used out of boost period to deliver a constant power to be delivered to the socket.",
    label: "Package Power Tracking (PPT) - Slow period",
    tab: "power",
    min: 1,
    max: 3600,
    step: 1,
    default: 900,
    ryzenadj_arg: "--slow-time=",
    ryzenadj_value_convert: "toThousand",
  },
  {
    description: "The limit of current we let the motherboard deliver to the PSI0.",
    label: "PSI0 Current Limit (mA)",
    tab: "power",
    min: 20,
    max: 100,
    step: 1,
    default: 20,
    ryzenadj_arg: "--psi0-current=",
    ryzenadj_value_convert: "toHex",
  },
  {
    description: "The limit of current we let the motherboard deliver to the CPU.",
    label: "VRM Current (A)",
    tab: "power",
    min: 20,
    max: 75,
    step: 1,
    default: 30,
    ryzenadj_arg: "--vrmmax-current=",
    ryzenadj_value_convert: "toThousand",
  },
  {
    description: "The minimum clock speed the integrated (Vega) GPU is allowed to run at.",
    label: "Minimum Vega iGPU Clock Frequency (Mhz)",
    tab: "gpu",
    min: 400,
    max: 1300,
    step: 1,
    default: 400,
    ryzenadj_arg: "--min-gfxclk=",
    ryzenadj_value_convert: "roundTen",
  },
  {
    description: "The maximum clock speed the integrated (Vega) GPU is allowed to run at.",
    label: "Maximum Vega iGPU Clock Frequency (Mhz)",
    tab: "gpu",
    min: 400,
    max: 1300,
    step: 1,
    default: 1100,
    ryzenadj_arg: "--max-gfxclk=",
    ryzenadj_value_convert: "roundTen",
  },
  {
    description:
      "Infinity Fabric is AMD's marketing term for the bus connection that connects processor dies (GPU/CPU). This define the bus's min. clock limit.",
    label: "Minimum Infinity Fabric frequency (Mhz)",
    tab: "gpu",
    min: 800,
    max: 1600,
    step: 1,
    default: 800,
    ryzenadj_arg: "--min-fclk-frequency=",
    ryzenadj_value_convert: null,
  },
  {
    description:
      "Infinity Fabric is AMD's marketing term for the bus connection that connects processor dies (GPU/CPU). This define the bus's max. clock limit.",
    label: "Maximum Infinity Fabric frequency (Mhz)",
    tab: "gpu",
    min: 800,
    max: 1600,
    step: 1,
    default: 1200,
    ryzenadj_arg: "--max-fclk-frequency=",
    ryzenadj_value_convert: null,
  },
  {
    description: "The temperature the CPU can reach before boost levels off.",
    label: "Temperature Limit (°C)",
    tab: "cpu",
    min: 50,
    max: 100,
    step: 1,
    default: 75,
    ryzenadj_arg: "--tctl-temp=",
    ryzenadj_value_convert: null,
  },
  {
    description:
      "Skin Temperature Aware Power Management. This will define the socket power package limit which is used to manage the device boost period.",
    label: "CPU TDP (W)",
    tab: "cpu",
    min: 5,
    max: 60,
    step: 1,
    default: 20,
    ryzenadj_arg: "--stapm-limit=",
    ryzenadj_value_convert: "toThousand",
  },
  {
    description: "Skin Temperature Aware Power Management. This will define the boost period to be used.",
    label: "CPU Boost Period",
    tab: "cpu",
    min: 1,
    max: 3600,
    step: 1,
    default: 900,
    ryzenadj_arg: "--stapm-time=",
    ryzenadj_value_convert: "toThousand",
  },
  {
    description: "The amount of power the CPU can draw while boost levels on.",
    label: "CPU Boost TDP (W)",
    tab: "cpu",
    min: 5,
    max: 60,
    step: 1,
    default: 25,
    ryzenadj_arg: "--fast-limit=",
    ryzenadj_value_convert: "toThousand",
  },
  {
    description: "The amount of power the CPU can draw while boost levels off.",
    label: "CPU Min TDP (W)",
    tab: "cpu",
    min: 5,
    max: 60,
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
      NotificationContext.warning("Please add some options before applying ryzenAdj.");
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
    NotificationContext.error("Unable to apply ryzenadj", "ryzenadj_applied");
    return;
  }

  if (parameters.length === 0) {
    NotificationContext.warning("Please add some options before applying ryzenAdj.");
    return;
  }

  ryzenAdjProcess(parameters)
    .then((output: string) => {
      if (notification) {
        NotificationContext.success("RyzenAdj has been executed successfully.", "ryzenadj_applied");
        console.log(output);
      }
    })
    .catch(err => {
      executeRyzenAdj(parameters, notification, retry - 1);
      console.error(err);
    });
};

export { RyzenAdjOptionDefinitions, getOptionDefinition, executeRyzenAdj, createRyzenAdjCommandLine };
