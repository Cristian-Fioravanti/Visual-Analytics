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
  // resetView()
  visualize()
  commonService.mode.observe((data)=> {
    if(commonService.mode.value=="Visualize") {
      commonService.setFirstSet([])
      commonService.setSecondSet([])
      visualize()
    } else {
      console.log(commonService.mode.value)
      commonService.setFirstSet([])
      commonService.setSecondSet([])
      compare()
    }

  })
  // getPCAForSchemas();
}

function visualize() {
  ajaxService.getAllDataPCA().done(function (jsonData) {
    console.log(jsonData.slice(0, 5));
    commonService.initializeScaleColor(jsonData);
    //Creation Schemas
    categoryService.insertCategory(jsonData);
    scatterPlotService.createScatterPlot(jsonData);

    boxplotsService.populateBoxplots(jsonData)
    
    parallelCoordinatesService.createParallelCoordinates(jsonData, []);
    histogramService.populateHistograms(jsonData);
    // histogramService.createHistogramLong(3,dataInstall,dataAppName);
  });
}

function compare() {
  ajaxService.getAllDataPCA().done(function (jsonData) {
    console.log(jsonData.slice(0, 5));
    commonService.initializeScaleColor(jsonData);
    //Creation Schemas
    categoryService.insertCategory(jsonData);
    scatterPlotService.createScatterPlot(jsonData);

    multiBoxPlotService.populateBoxplots();

    parallelCoordinatesService.createParallelCoordinatesCompare();
    // histogramService.populateHistograms();
    // createHistogramInstalls(jsonData);
    // histogramService.createHistogramLong(3,dataInstall,dataAppName);
  });
}
