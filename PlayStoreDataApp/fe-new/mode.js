import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";

function main() {
  var button = d3.select("#bottone");
  button.on("click", function (d) {
    if (button.text() == "Visualize") {
      button.text("Compare");
      button.classed("button-compare", true)
      button.classed("button-visualize",false)
      commonService.setMode("Compare");
    } else {
      button.text("Visualize");
      button.classed("button-compare", false)
      button.classed("button-visualize",true)
      commonService.setMode("Visualize");
      this.style.backgroundColor="blu"
    }
  });
}
main();
