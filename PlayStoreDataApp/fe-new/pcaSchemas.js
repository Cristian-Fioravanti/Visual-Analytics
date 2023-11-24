import * as scatterPlotService  from "./scatterPlot.js";
import * as ajaxService from "./ajaxService.js";
import *  as parallelCoordinatesService from "./parallelCoordinates.js";

main();

function main() {
  getPCAForSchemas();
}

function getPCAForSchemas() {
  ajaxService.getAllDataPCA().done(function (jsonData) {
    console.log(jsonData)
    scatterPlotService.createScatterPlot(jsonData)
    parallelCoordinatesService.createParallelCoordinates(jsonData)
  })
}