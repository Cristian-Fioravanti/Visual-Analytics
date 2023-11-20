import "https://d3js.org/d3.v5.min.js";
import "./interface.js";

let ListPlayStoreData = [];
main();

function main() {
  createBoxPlot(1);
  createBoxPlot(2);
  createBoxPlot(3);
  createBoxPlot(4);
}
function createBoxPlot(i) {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 30, left: 30 },
    width = 320 - margin.left - margin.right,
    height = 190 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#boxPlot"+i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // create dummy data
  var data = [12, 19, 11, 13, 12, 22, 13, 4, 15, 16, 18, 19, 20, 12, 11, 9];

  // Compute summary statistics used for the box:
  var data_sorted = data.sort(d3.ascending);
  var q1 = d3.quantile(data_sorted, 0.25);
  var median = d3.quantile(data_sorted, 0.5);
  var q3 = d3.quantile(data_sorted, 0.75);
  var interQuantileRange = q3 - q1;
  var min = q1 - 1.5 * interQuantileRange;
  var max = q1 + 1.5 * interQuantileRange;

  // Show the Y scale
  var y = d3.scaleLinear().domain([0, 24]).range([height, 0]);
  svg.call(d3.axisLeft(y));

  // a few features for the box
  var center = 200;
  var width = 100;

  // Show the main vertical line
  svg.append("line").attr("x1", center).attr("x2", center).attr("y1", y(min)).attr("y2", y(max)).attr("stroke", "black");

  // Show the box
  svg
    .append("rect")
    .attr("x", center - width / 2)
    .attr("y", y(q3))
    .attr("height", y(q1) - y(q3))
    .attr("width", width)
    .attr("stroke", "black")
    .style("fill", "#FFA400");

  // show median, min and max horizontal lines
  svg
    .selectAll("toto")
    .data([min, median, max])
    .enter()
    .append("line")
    .attr("x1", center - width / 2)
    .attr("x2", center + width / 2)
    .attr("y1", function (d) {
      return y(d);
    })
    .attr("y2", function (d) {
      return y(d);
    })
    .attr("stroke", "black");
}

