function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
ready(function(){
  var ranges = document.querySelectorAll('[repeat]');
  for (const range in ranges) {
    if (ranges.hasOwnProperty(range)) {
      const element = ranges[range];
      element.addEventListener('change', function(event) {
        var repeater = document.getElementById(event.target.attributes.repeat.value);
        repeater.value = event.target.value;
      });
    }
  }
});
/*
stapm_limit_w_range
ppt_fast_limit_w_range
ppt_slow_limit_w_range
temperature_limit_c_range
vrm_current_m_a_range
*/
