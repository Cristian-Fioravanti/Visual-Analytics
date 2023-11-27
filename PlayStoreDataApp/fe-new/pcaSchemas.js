import * as scatterPlotService  from "./scatterPlot.js";
import * as ajaxService from "./ajaxService.js";
import *  as parallelCoordinatesService from "./parallelCoordinates.js";
import * as categoryService from "./category.js"
import * as histogramService from "./histogram.js"

import * as commonService from "./commonService.js"

main();

function main() {
  getPCAForSchemas();
}

function getPCAForSchemas() {
  
  ajaxService.getAllDataPCA().done(function (jsonData) {
    console.log(jsonData.slice(0,5))
    commonService.initializeScaleColor(jsonData)
    //Creation Schemas
    categoryService.insertCategory(jsonData)
    scatterPlotService.createScatterPlot(jsonData)
    parallelCoordinatesService.createParallelCoordinates(jsonData)
    //Histogram
    let dataInstalls = []
    let dataAppName = []
    jsonData.forEach(obj => {
      var objAux = JSON.parse(`{"Installs": ${obj.Installs}}`)
      dataInstalls.push(objAux)
      dataAppName.push(obj.App)
    });
 
    histogramService.createHistogramShort(1,dataInstalls, dataAppName)
    histogramService.createHistogramShort(2,dataInstalls,dataAppName);
    // histogramService.createHistogramLong(3,dataInstall,dataAppName);
  })
}
