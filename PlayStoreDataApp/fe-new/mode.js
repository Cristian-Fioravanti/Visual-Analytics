import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";
import {setAxisToInitialValue} from "./scatterPlot.js";
function main() {
  var button = d3.select("#bottone");
  button.on("click", function (d) {
    setAxisToInitialValue()
    if (button.text() == "Visualize") {
      button.text("Compare");
      button.classed("button-compare", true);
      button.classed("button-visualize", false);
      commonService.setMode("Compare");
      d3.select("#computePCAImg").style("display","block")
    } else {
      button.text("Visualize");
      button.classed("button-compare", false);
      button.classed("button-visualize", true);
      this.style.backgroundColor = "blu";
      d3.select("#computePCAImg").style("display", "none")
      
      commonService.setMode("Visualize");
      
    }
  });
}
main();
