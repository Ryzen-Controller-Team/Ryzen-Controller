import * as React from "react";
import Card from "./Card";
import SysInfoContext from "../contexts/SysInfoContext";

function SysInfoCards() {
  return (
    <SysInfoContext.Consumer>
      {sysInfoContext => {
        if (sysInfoContext.error) {
          return (
            <Card title="Error">
              Unable to get system info:
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
            <Card title="Basic Information">
              {system === false || mem === false || bios === false ? (
                <div uk-spinner=""></div>
              ) : (
                <React.Fragment>
                  {system.manufacturer} {system.model} {system.version}
                  <br />
                  Bios version: {bios.version} {bios.revision ? `rev${bios.revision}` : ""}
                  <br />
                  {(mem.total / (1024 * 1024 * 1024)).toFixed(2)}Gb Ram
                </React.Fragment>
              )}
            </Card>
            <Card title="CPU Information">
              {cpu === false ? (
                <div uk-spinner=""></div>
              ) : (
                <React.Fragment>
                  {cpu.manufacturer} {cpu.brand}
                  <br />
                  {cpu.speedmax}Ghz on {cpu.physicalCores} cores, {cpu.cores} threads.
                </React.Fragment>
              )}
            </Card>
            {gpu === false ? (
              <Card title={`GPU #0 Information`}>
                <div uk-spinner=""></div>
              </Card>
            ) : (
              <React.Fragment>
                {gpu.controllers.map((controller, index) => (
                  <Card key={`gpu-${index}`} title={`GPU #${index} Information`}>
                    {controller.vendor} {controller.model}
                    <br />
                    {controller.vram}Mb (Dynamic vram: {controller.vramDynamic.toString()})
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
