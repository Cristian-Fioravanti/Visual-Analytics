import * as scatterPlotService from "./scatterPlot.js";
import * as ajaxService from "./ajaxService.js";
import * as parallelCoordinatesService from "./parallelCoordinates.js";
import * as categoryService from "./category.js"
import * as boxplotsService from "./boxPlot.js"
import * as multiBoxPlotService from "./multiBloxPlot.js"
import * as histogramService from "./histogram.js";
import * as commonService from "./commonService.js"
import * as modeService from "./mode.js"


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

    // boxplotsService.populateBoxplots(jsonData)
    multiBoxPlotService.populateBoxplots();

    parallelCoordinatesService.createParallelCoordinates(jsonData);
    histogramService.populateHistograms();
    // createHistograms(jsonData);
    // histogramService.createHistogramLong(3,dataInstall,dataAppName);
  });
}
function createHistograms(jsonData) {
  const dataInstalls = jsonData.map(obj => ({ Installs: parseInt(obj.Installs) }));

  const dataType = Array.from(new Set(jsonData.map(obj => obj.Type)))
    .map(Type => ({ Type, Total: jsonData.filter(x => x.Type === Type).length }));

  const dataContentRating = Array.from(new Set(jsonData.map(obj => obj.Content_Rating)))
    .map(ContentRating => ({
      ContentRating,
      Total: jsonData.filter(x => x.Content_Rating === ContentRating).length
    }));

  const heightY = jsonData.length;

  // histogramService.createHistogramShortType(1, dataType, Array.from(new Set(jsonData.map(obj => obj.Type))), heightY);
  // histogramService.createHistogramShortContentRating(2, dataContentRating, Array.from(new Set(jsonData.map(obj => obj.Content_Rating))), heightY);
  // histogramService.createHistogramShortInstalls(3, dataInstalls);
}
