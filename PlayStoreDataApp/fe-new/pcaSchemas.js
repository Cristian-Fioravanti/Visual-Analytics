import * as scatterPlotService from "./scatterPlot.js";
import * as ajaxService from "./ajaxService.js";
import * as parallelCoordinatesService from "./parallelCoordinates.js";
import * as categoryService from "./category.js"
import * as boxplotsService from "./boxPlot.js"
import * as histogramService from "./histogram.js";
import * as commonService from "./commonService.js"

main();

function main() {
  getPCAForSchemas();
}

function getPCAForSchemas() {
  ajaxService.getAllDataPCA().done(function (jsonData) {
    console.log(jsonData.slice(0, 5));
    commonService.initializeScaleColor(jsonData);
    //Creation Schemas
    categoryService.insertCategory(jsonData);
    scatterPlotService.createScatterPlot(jsonData);
    boxplotsService.populateBoxplots(jsonData)
    parallelCoordinatesService.createParallelCoordinates(jsonData);
    // createHistogramInstalls(jsonData);
    // histogramService.createHistogramLong(3,dataInstall,dataAppName);
  });
}
function createHistogramInstalls(jsonData) {
  //Histogram
  let dataInstalls = [];
  let dataType = [];
  let dataAppName = [];
  let dataTypeSet = new Set();
  jsonData.forEach((obj) => {
    dataAppName.push(obj.App);
    var objInstalls = JSON.parse(`{"Installs": ${obj.Installs}}`);
    dataInstalls.push(objInstalls);
    
    dataTypeSet.add(obj.Type)
  });
  dataTypeSet.forEach((Type) => {
  var objType = JSON.parse(`{"Type": "${Type}","Total": ${jsonData.filter(x=> x.Type == Type).length}}`);

  dataType.push(objType)
  })

  let heightY=jsonData.length
  histogramService.createHistogramShortInstalls(1, dataInstalls);
  
  histogramService.createHistogramShortType(2, dataType, Array.from(dataTypeSet),heightY );
}
