import * as scatterPlotService from "./scatterPlot.js";
import * as ajaxService from "./ajaxService.js";
import * as parallelCoordinatesService from "./parallelCoordinates.js";
import * as categoryService from "./category.js"
import * as boxplotsService from "./boxPlot.js"
import * as multiBoxPlotService from "./multiBloxPlot.js"
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
    createHistogramInstalls(jsonData);
    // histogramService.createHistogramLong(3,dataInstall,dataAppName);
  });
  ajaxService.getDifferentGroups().done(function (jsondata) {
    multiBoxPlotService.populateBoxplots(jsondata);
  })
}
function createHistogramInstalls(jsonData) {
  //Histogram
  let dataInstalls = [];
  let dataType = [];
  let dataAppName = [];
  let dataContentRating = [];
  let dataTypeSet = new Set();
  let dataContentRatingSet = new Set();
  jsonData.forEach((obj) => {
    dataAppName.push(obj.App);
    var objInstalls = JSON.parse(`{"Installs": ${obj.Installs}}`);
    dataInstalls.push(objInstalls);

    dataContentRatingSet.add(obj.Content_Rating);
    dataTypeSet.add(obj.Type);
  });
  dataTypeSet.forEach((Type) => {
    var objType = JSON.parse(`{"Type": "${Type}","Total": ${jsonData.filter((x) => x.Type == Type).length}}`);
    dataType.push(objType);
  });

  dataContentRatingSet.forEach((ContentRating) => {
    var objContentRating = JSON.parse(`{"ContentRating": "${ContentRating}","Total": ${jsonData.filter((x) => x.Content_Rating == ContentRating).length}}`);

    dataContentRating.push(objContentRating);
  });

  let heightY = jsonData.length;
 

  histogramService.createHistogramShortType(1, dataType, Array.from(dataTypeSet), heightY);
  histogramService.createHistogramShortContentRating(2, dataContentRating, Array.from(dataContentRatingSet), heightY);
  histogramService.createHistogramShortInstalls(3, dataInstalls);
}
