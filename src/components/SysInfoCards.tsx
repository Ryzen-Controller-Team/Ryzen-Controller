import * as React from "react";
import Card from "./Card";
import SysInfoContext from "../contexts/SysInfoContext";
import { getTranslation } from "../contexts/LocaleContext";

function SysInfoCards() {
  return (
    <SysInfoContext.Consumer>
      {sysInfoContext => {
        if (sysInfoContext.error) {
          return (
            <Card title="Error">
              {getTranslation("sysInfoCards.unableToGetSysInfo", "Unable to get system info:")}
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
          <div className="uk-margin-small-right uk-margin-small-left uk-flex uk-flex-center uk-flex-around uk-flex-wrap">
            <Card title={getTranslation("sysInfoCards.basicInfoTitle", "Basic Information")}>
              {system === false || mem === false || bios === false ? (
                <div uk-spinner=""></div>
              ) : (
                <React.Fragment>
                  {system.manufacturer} {system.model} {system.version}
                  <br />
                  {getTranslation("sysInfoCards.biosVersion", "Bios version:")} {bios.version}{" "}
                  {bios.revision ? `rev${bios.revision}` : ""}
                  <br />
                  {(mem.total / (1024 * 1024 * 1024)).toFixed(2)}Gb Ram
                </React.Fragment>
              )}
            </Card>
            <Card title={getTranslation("sysInfoCards.CPUInfoTitle", "CPU Information")}>
              {cpu === false ? (
                <div uk-spinner=""></div>
              ) : (
                <React.Fragment>
                  {cpu.manufacturer} {cpu.brand}
                  <br />
                  {getTranslation(
                    "sysInfoCards.cpuPerfDesc",
                    "{speedmax}Ghz on {physicalCores} cores, {cores} threads.",
                    {
                      speedmax: cpu.speedmax,
                      physicalCores: cpu.physicalCores.toString(),
                      cores: cpu.cores.toString(),
                    }
                  )}
                </React.Fragment>
              )}
            </Card>
            {gpu === false ? (
              <Card title={getTranslation("sysInfoCards.GPUInfoTitle", "GPU #{index} Information", { index: "0" })}>
                <div uk-spinner=""></div>
              </Card>
            ) : (
              <React.Fragment>
                {gpu.controllers.map((controller, index) => (
                  <Card
                    key={`gpu-${index}`}
                    title={getTranslation("sysInfoCards.GPUInfoTitle", "GPU #{index} Information", {
                      index: `${index}`,
                    })}
                  >
                    {controller.vendor} {controller.model}
                    <br />
                    {getTranslation("sysInfoCards.gpuPerfDesc", "{ram}Mb (Dynamic vram: {dyn}).", {
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
