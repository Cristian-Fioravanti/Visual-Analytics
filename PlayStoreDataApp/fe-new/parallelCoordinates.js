import "./interface.js";
import * as categoryService from "./category.js"
import * as commonService from "./commonService.js"
let countClick = 0;
let scaleColor; 

function createParallelCoordinates(jsonPCAData) {
  scaleColor = commonService.getScaleColor()
  // jsonPCAData = jsonPCAData.slice(0, 5);
  
  // console.log(commonService.distinctValuesPerKey(jsonPCAData))
  
  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 10, bottom: 10, left: 30 },
    width = 768 - margin.left - margin.right,
    height = 330 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#parallelCoordinates")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let dimensions = ["Rating", "Reviews", "Size", "Installs", "Price","Content_Rating","Type"];
  let dimensionsString = [  "Content_Rating", "Type"]
  const distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData)
  // For each dimension, build a linear scale and store it in the y object
  var y = {};
  dimensions.forEach((dim) => {
    if (dimensionsString.includes(dim)) {
      y[dim] = d3
        .scalePoint()
        .domain(distinctPCAData[dim])
        .range([0,height]);
    }
    else {
      y[dim] = d3
        .scaleLinear()
        .domain([
          d3.min(jsonPCAData, function (d) {
            return +d[dim];
          }),
          d3.max(jsonPCAData, function (d) {
            return +d[dim];
          }),
        ])
        .range([height, 0]);
    }
  });

  // Build the X scale -> it finds the best position for each Y axis
  var x = d3.scalePoint().range([0, width]).padding(1).domain(dimensions);

  // The path function takes a row of the data as input and returns x and y coordinates of the line to draw for this row.
  function path(d) {
    return d3.line()(
      dimensions.map(function (p) {
        if (dimensionsString.includes(p)) return [x(p), y[p](d[p])];
        else return [x(p), y[p](+d[p])];
      })
    );
  }

  function getColorPath(d) {
    return scaleColor(d.Category)
  }
  // Draw the lines
  svg
    .selectAll(".myPath")
    .data(jsonPCAData)
    .enter()
    .append("path")
    .attr("class", "myPath")
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", getColorPath)
    .style("stroke-width", "0.5px")
    .style("opacity", 0.5);
  // Draw the axis
  svg
    .selectAll(".myAxis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "myAxis")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    })
    .each(function (d) {
      d3.select(this).call(d3.axisLeft().scale(y[d]));
    })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function (d) {
      return d;
    })
    .style("fill", "white");
}

export { createParallelCoordinates };
