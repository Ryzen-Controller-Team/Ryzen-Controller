var os = require("os");


var title = document.getElementById('title').innerHTML;
var cpus = os.cpus();
var cpucount = cpus.length;
var cpucores;
var cpuman;
var cpuspeed;
var cpuspeedmhz;
var platform;
var mem;
var totalmem;
var gputest1;

cpus.forEach(function (cpu, i) {
    cpuman = "<strong>Processor Model: </strong>" + cpu.model;
    cpuspeed = cpu.speed;
    cpuspeedmhz = "<strong>Processor Frequency: </strong>" + cpuspeed.toString() + "MHz";
    platform = os.platform();
    mem = os.totalmem();
    mem = mem / 1000000000;
    mem = Math.trunc(mem);
    totalmem = "<strong>System Memory: </strong>" + mem.toString()+ " " + "GB";
    cpucores = "<strong>Processor Cores: </strong>" + cpucount.toString();
    if(platform == "win32"){
        platform = "<strong>Platform: </strong>" + "Windows " + os.release();
    } else if(platform == "linux"){
        platform = "<strong>Platform: </strong>" + "Linux " + os.release();
    }
    
    


});

var canvas;
    canvas = document.getElementById("glcanvas");
    var gl = canvas.getContext("experimental-webgl");

function getUnmaskedInfo(gl) {
      var unMaskedInfo = {
        renderer: '',
        vendor: ''
      };

      var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbgRenderInfo != null) {
        unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
        unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
      }

      return unMaskedInfo;
    }
  
gputest1 = getUnmaskedInfo(gl).renderer;

if(gputest1 =="ANGLE (AMD Radeon(TM) RX Vega 10 Graphics Direct3D11 vs_5_0 ps_5_0)"){
    gputest1 = "AMD Radeon(TM) RX Vega 10 Graphics"
} else if (gputest1 =="ANGLE (AMD Radeon(TM) RX Vega 8 Graphics Direct3D11 vs_5_0 ps_5_0)"){
    gputest1 = "AMD Radeon(TM) RX Vega 8 Graphics"
} else if(gputest1 =="ANGLE (AMD Radeon(TM) RX Vega 8 Mobile Graphics Direct3D11 vs_5_0 ps_5_0)"){
    gputest1 = "AMD Radeon(TM) RX Vega 8 Graphics"
} else if(gputest1 =="ANGLE (AMD Radeon(TM) RX Vega 3 Graphics Direct3D11 vs_5_0 ps_5_0)"){
    gputest1 = "AMD Radeon(TM) RX Vega 3 Graphics"
} else if(gputest1 =="ANGLE (AMD Radeon(TM) RX Vega 3 Mobile Graphics Direct3D11 vs_5_0 ps_5_0)"){
    gputest1 = "AMD Radeon(TM) RX Vega 3 Graphics"
}


document.getElementById('titleShown').innerHTML = title;
document.getElementById('cpu').innerHTML = cpuman;
document.getElementById('cores').innerHTML = cpucores;
document.getElementById('cpuspeed').innerHTML = cpuspeedmhz;
document.getElementById('platform').innerHTML = platform;
document.getElementById('memory').innerHTML = totalmem;
document.getElementById('gpu1').innerHTML = "<strong>GPU: </strong>" + gputest1;

