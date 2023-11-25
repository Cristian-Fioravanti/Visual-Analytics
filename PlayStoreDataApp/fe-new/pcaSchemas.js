import * as scatterPlotService  from "./scatterPlot.js";
import * as ajaxService from "./ajaxService.js";
import *  as parallelCoordinatesService from "./parallelCoordinates.js";
import * as categoryService from "./category.js"
import * as commonService from "./commonService.js"

main();

function main() {
  getPCAForSchemas();
}

function getPCAForSchemas() {
  
  ajaxService.getAllDataPCA().done(function (jsonData) {
    console.log(jsonData)
    commonService.initializeScaleColor(jsonData)
    //Creation Schemas
    categoryService.insertCategory(jsonData)
    scatterPlotService.createScatterPlot(jsonData)
    parallelCoordinatesService.createParallelCoordinates(jsonData)
  })
}
