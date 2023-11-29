import "https://d3js.org/d3.v5.min.js";
import "./interface.js";

let ListPlayStoreData = [];
main();

function main() {
  // createBoxPlot(1);
  // createBoxPlot(2);
  // createBoxPlot(3);
  // createBoxPlot(4);
}

function populateBoxplots(data) {
  // console.log("Rating",data.map(item => item.Rating))
  // console.log("Reviews",data.map(item => item.Reviews))
  // console.log("Installations",data.map(item => item.Installs))
  // console.log("Size",data.map(item => item.Size))
  let data1 = data.map(item => item.Rating)
  createBoxPlot(data1, 1)
  let data2  = data.map(item => item.Reviews)
  createBoxPlot(data2, 2)
  let data3 = data.map(item => item.Installs)
  createBoxPlot(data3, 3)
  let data4 = data.map(item => item.Size)
  createBoxPlot(data4, 4)
};

function createBoxPlot(data, i) {
  // set the dimensions and margins of the graph
  var margin = { top: 5, right: 10, bottom: 30, left: 30 },
    width = 298 - margin.left - margin.right,
    height = 154 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#boxPlot" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // create dummy data
  // var data = [12, 19, 11, 13, 12, 22, 13, 4, 15, 16, 18, 19, 20, 12, 11, 9];

  // Compute summary statistics used for the box:
  var data_sorted = data.sort(d3.ascending);
  var q1 = d3.quantile(data_sorted, 0.25);
  var median = d3.quantile(data_sorted, 0.5);
  var q3 = d3.quantile(data_sorted, 0.75);
  var interQuantileRange = q3 - q1;
  var min = q1 - 1.5 * interQuantileRange;
  var max = q1 + 1.5 * interQuantileRange;

  // Show the Y scale
  var y = d3.scaleLinear().domain([d3.min(data), d3.max(data)]).range([height, 0]);
  svg.call(d3.axisLeft(y));

  // a few features for the box
  var center = 200;
  var width = 100;
  var click = function (d) {
    if (d == min) {
      svg.select(".down");
      var isSelected = svg.select(".down").classed("selectedBoxPlotLine");

      // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
      if (isSelected) {
        svg.select(".down").classed("selectedBoxPlotLine", false);
      } else {
        svg.select(".down").classed("selectedBoxPlotLine", true);
      }
    }
    else if(d==max) {
      svg.select(".up");
      var isSelected = svg.select(".up").classed("selectedBoxPlotLine");

      // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
      if (isSelected) {
        svg.select(".up").classed("selectedBoxPlotLine", false);
      } else {
        svg.select(".up").classed("selectedBoxPlotLine", true);
      }
    }
    if (d != median) {
    var isSelected = d3.select(this).classed("selectedBoxPlotLine");

    // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
    if (isSelected) {
      d3.select(this).classed("selectedBoxPlotLine", false);
    } else {
      d3.select(this).classed("selectedBoxPlotLine", true);
    }
    }
    
  };

  var removePointerInMiddle = function (d) {
    if (d == median) {
      d3.select(this).classed("toto", false)
    }
  }

  var clickRect = function (d) { 
    var isSelected = d3.select(this).classed("selectedBoxPlotRect");

    // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
    if (isSelected) {
      d3.select(this).classed("selectedBoxPlotRect", false);
    } else {
      d3.select(this).classed("selectedBoxPlotRect", true);
    }
   
  }

  // Show the upper vertical line
  svg
    .append("line")

    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min))
    .attr("y2", y((min + max) / 2)) // Puoi regolare questa coordinata per adattarla al tuo grafico
    .attr("stroke", "white")
    .attr("stroke-width", "2px")
    .classed("down", true);

  // Show the lower vertical line
  svg
    .append("line")

    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y((min + max) / 2)) // Puoi regolare questa coordinata per adattarla al tuo grafico
    .attr("y2", y(max))
    .attr("stroke", "white")
    .attr("stroke-width", "0.5px")
    .classed("up", true);
  // Show the box
// Show the first box (sopra la linea median)
svg.append("rect")
   .attr("x", center - width / 2)
   .attr("y", y(q3))
   .attr("height", y(median) - y(q3))  // Lato più lungo in basso deve equivalere alla linea median
   .attr("width", width)
   .attr("stroke", "black")
   .attr("cursor", "pointer")
   .style("fill", "rgb(255, 164, 0,0.5)")
   .on("click", clickRect);

// Show the second box (sotto la linea median)
svg.append("rect")
   .attr("x", center - width / 2)
   .attr("y", y(median))
   .attr("height", y(q1) - y(median))  // Lato più lungo in alto deve equivalere alla linea median
   .attr("width", width)
   .attr("stroke", "black")
   .attr("cursor", "pointer")
   .style("fill", "rgb(255, 164, 0,0.5)")
   .on("click", clickRect);

  
  svg.selectAll("rect").classed("selectedBoxPlotRect", true)

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
    .attr("stroke", "black")
    .attr("stroke-width", "2px")
    .classed("toto",true)
    .on("click", click).on("mouseover",removePointerInMiddle);
  
    
}

export { populateBoxplots };