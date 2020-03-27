import * as React from "react";
import Card from "./Card";
import SysInfoContext from "../contexts/SysInfoContext";
import { getTranslation, variablesInTranslation } from "../contexts/LocaleContext";

const unableToGetSysInfoText = getTranslation("sysInfoCards.unableToGetSysInfo", "Unable to get system info:");
const basicInfoTitleText = getTranslation("sysInfoCards.basicInfoTitle", "Basic Information");
const biosVersionText = getTranslation("sysInfoCards.biosVersion", "Bios version:");
const CPUInfoTitleText = getTranslation("sysInfoCards.CPUInfoTitle", "CPU Information");
const cpuPerfDescText = getTranslation(
  "sysInfoCards.cpuPerfDesc",
  "{speedmax}Ghz on {physicalCores} cores, {cores} threads."
);
const GPUInfoTitleText = getTranslation("sysInfoCards.GPUInfoTitle", "GPU #{index} Information");
const gpuPerfDescText = getTranslation("sysInfoCards.gpuPerfDesc", "{ram}Mb (Dynamic vram: {dyn}).");

function SysInfoCards() {
  return (
    <SysInfoContext.Consumer>
      {sysInfoContext => {
        if (sysInfoContext.error) {
          return (
            <Card title="Error">
              {unableToGetSysInfoText}
              <br />
              {sysInfoContext.error}
            </Card>
          );
        }

        const system = sysInfoContext.system;
        const cpu = sysInfoContext.cpu;
        const mem = sysInfoContext.mem;
        const gpu = sysInfoContext.graphics;
        const bios = sysInfoContext.bios;
        return (
          <div className="uk-margin-small-right uk-margin-small-left uk-flex uk-flex-left uk-flex-wrap">
            <Card title={basicInfoTitleText}>
              {system === false || mem === false || bios === false ? (
                <div uk-spinner=""></div>
              ) : (
                <React.Fragment>
                  {system.manufacturer} {system.model} {system.version}
                  <br />
                  {biosVersionText} {bios.version} {bios.revision ? `rev${bios.revision}` : ""}
                  <br />
                  {(mem.total / (1024 * 1024 * 1024)).toFixed(2)}Gb Ram
                </React.Fragment>
              )}
            </Card>
            <Card title={CPUInfoTitleText}>
              {cpu === false ? (
                <div uk-spinner=""></div>
              ) : (
                <React.Fragment>
                  {cpu.manufacturer} {cpu.brand}
                  <br />
                  {variablesInTranslation(cpuPerfDescText, {
                    speedmax: cpu.speedmax,
                    physicalCores: cpu.physicalCores.toString(),
                    cores: cpu.cores.toString(),
                  })}
                </React.Fragment>
              )}
            </Card>
            {gpu === false ? (
              <Card title={variablesInTranslation(GPUInfoTitleText, { index: "0" })}>
                <div uk-spinner=""></div>
              </Card>
            ) : (
              <React.Fragment>
                {gpu.controllers.map((controller, index) => (
                  <Card
                    key={`gpu-${index}`}
                    title={variablesInTranslation(GPUInfoTitleText, {
                      index: `${index}`,
                    })}
                  >
                    {controller.vendor} {controller.model}
                    <br />
                    {variablesInTranslation(gpuPerfDescText, {
                      ram: controller.vram.toString(),
                      dyn: controller.vramDynamic.toString(),
                    })}
                  </Card>
                ))}
              </React.Fragment>
            )}
          </div>
        );
      }}
    </SysInfoContext.Consumer>
  );
}

export default SysInfoCards;
