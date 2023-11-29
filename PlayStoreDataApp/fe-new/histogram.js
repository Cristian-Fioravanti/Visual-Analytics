import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";

// main();

function main() {
  // createHistogramShort(1,dataSet);
  // createHistogramShort(2,dataSet);
  // createHistogramLong(3,dataSet);
}

export function createHistogramShortInstalls(i, dataSet) {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#Histogram" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // get the data

  // X axis: scale and draw:
  var x = d3
    .scaleLog()
    .domain([1, 100000000000]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "HistogramSvg" + i)
    .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d.Installs;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(10)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(dataSet);

  // Y axis: scale and draw:
  var y = d3.scaleLinear().range([height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); // d3.hist has to be called before the Y axis obviously
  svg.append("g").call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", function (d) {
      return x(d.x1) - x(d.x0) - 1;
    })
    .attr("height", function (d) {
      return height - y(d.length);
    })
    .style("fill", "#69b3a2");
}
export function createHistogramShortType(i, dataSet, dataAppName, heightY) {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 298 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#Histogram" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis: scale and draw:
  var x = d3
    .scalePoint()
    .domain(dataAppName) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width])
    .padding(1);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
   
    .call(d3.axisBottom(x));

  // And apply this function to data to get the bins
  // var bins = histogram(dataSet);

  // Y axis: scale and draw:
 // Y axis: scale and draw:
  var y = d3.scaleSymlog().range([height, 0]).domain([0, heightY]);
  let minY = y.domain()[0]
  let maxY = y.domain()[1]
  function generateCustomTicks(y) {
    var tickValues = [y.domain()[0]];
    var currentValue = y.domain()[1];

    while (currentValue > 10) {
        currentValue /= 2;
        tickValues.push(currentValue);
    }

    tickValues.push(y.domain()[1]);

    return tickValues;
}

// Utilizzo della funzione con il tuo esempio:
svg.append("g").call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0)).attr("class", "HistogramSvg" + i);

  // append the bar rectangles to the svg element
  svg
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + (x(d.Type) - 5) + "," + y(d.Total) + ")";
    })
    .attr("width", function (d) {
      return 10;
    })
    .attr("height", function (d) {
      return height - y(d.Total);
    })
    .style("fill", "#69b3a2");
}

export function createHistogramShortContentRating(i, dataSet, dataAppName, heightY) {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 298 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#Histogram" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis: scale and draw:
  var x = d3
    .scalePoint()
    .domain(dataAppName) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width])
    .padding(1);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "HistogramSvg" + i)
    .call(d3.axisBottom(x));

  // And apply this function to data to get the bins
  // var bins = histogram(dataSet);

  // Y axis: scale and draw:
  var y = d3.scaleSymlog().range([height, 0]).domain([0, heightY]);
  let minY = y.domain()[0]
  let maxY = y.domain()[1]
  function generateCustomTicks(y) {
    var tickValues = [y.domain()[0]];
    var currentValue = y.domain()[1];

    while (currentValue > 10) {
        currentValue /= 2;
        tickValues.push(currentValue);
    }

    tickValues.push(y.domain()[1]);

    return tickValues;
}

// Utilizzo della funzione con il tuo esempio:
svg.append("g").call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0)).attr("class", "HistogramSvg" + i);

  // append the bar rectangles to the svg element
  svg
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + (x(d.ContentRating) - 5) + "," + y(d.Total) + ")";
    })
    .attr("width", function (d) {
      return 10;
    })
    .attr("height", function (d) {
      return height - y(d.Total);
    })
    .style("fill", "#69b3a2");
}