import { createContext } from "react";
import { Systeminformation } from "systeminformation";

const hasher = require("object-hash");

export type SysInfoState = {
  cpu: Systeminformation.CpuData | false;
  graphics: Systeminformation.GraphicsData | false;
  mem: Systeminformation.MemData | false;
  memLayout: Array<Systeminformation.MemLayoutData> | false;
  system: Systeminformation.SystemData | false;
  bios: Systeminformation.BiosData | false;
  signature: string | false;
  error?: string;
};

const createMachineSignature = function(data: SysInfoState): string | false {
  if (data.error) {
    return false;
  }
  if (data.system === false || data.mem === false || data.cpu === false || data.graphics === false) {
    return false;
  }

  return hasher({
    "system.manufacturer": data.system.manufacturer,
    "system.model": data.system.model,
    "system.version": data.system.version,
    "mem.total": data.mem.total,
    "cpu.manufacturer": data.cpu.manufacturer,
    "cpu.brand": data.cpu.brand,
    "cpu.speedmax": data.cpu.speedmax,
    "cpu.physicalCores": data.cpu.physicalCores,
    "cpu.cores": data.cpu.cores,
    "gpu.controllers": data.graphics.controllers,
  });
};

let context: SysInfoState = {
  cpu: false,
  graphics: false,
  mem: false,
  memLayout: false,
  system: false,
  bios: false,
  signature: false,
};

const SysInfoContext = createContext(context);
SysInfoContext.displayName = "SysInfoContext";

export default SysInfoContext;
export { createMachineSignature };
