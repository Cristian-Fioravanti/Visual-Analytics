import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";

function populateBoxplots(data) {
  let data1 = data.map(item => item.Rating)
  createBoxPlot(data1, 1, "Ratings")
  let data2  = data.map(item => item.Reviews)
  createBoxPlot(data2, 2, "Reviews")
  let data3 = data.map(item => item.Installs)
  createBoxPlot(data3, 3, "Installs")
  let data4 = data.map(item => item.Size)
  createBoxPlot(data4, 4, "Size")
  commonService.firstSet.observe((data) => {
    var newData = commonService.firstSet.value;
    let data1 = newData.map(item => item.Rating)
    createBoxPlot(data1, 1, "Ratings")
    let data2  = newData.map(item => item.Reviews)
    createBoxPlot(data2, 2, "Reviews")
    let data3 = newData.map(item => item.Installs)
    createBoxPlot(data3, 3, "Installs")
    let data4 = newData.map(item => item.Size)
    createBoxPlot(data4, 4, "Size")
  });
  
  
};

function createBoxPlot(data, i, title) {
  // set the dimensions and margins of the graph
  var margin = { top: 25, right: 0, bottom: 5, left: 40 },
    width = 298 - margin.left - margin.right,
    height = 167 - margin.top - margin.bottom;

  var svg = d3.select("#boxPlot" + i).select("svg")
  if(svg.empty()) {
    svg = d3
    .select("#boxPlot" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  // append the svg object to the body of the page
  
  // Compute summary statistics used for the box:
  var data_sorted = data.sort(d3.ascending);
  var q1 = d3.quantile(data_sorted, 0.25);
  var median = d3.quantile(data_sorted, 0.5);
  var q3 = d3.quantile(data_sorted, 0.75);
  var interQuantileRange = q3 - q1;
  var min = d3.min(data_sorted);
  var max = d3.max(data_sorted);

  // Show the Y scale
  if(max-min<10)
    var y = d3.scaleLinear().domain([d3.min(data_sorted), d3.max(data_sorted)]).range([height, 0]);  
  else
    var y = d3.scaleLog().domain([1, d3.max(data_sorted)]).range([height, 0]);
  
  var powerLabels = d3
    .range(0, Math.ceil(Math.log10(d3.max(data_sorted))+1))
    .map(function(d) { return Math.pow(10, d); });
  var yAxisFormat = d3.format("");
  if(d3.max(data_sorted)>10) {
    var yAxis = d3.axisLeft(y)
      .tickValues(powerLabels)
      .tickFormat(yAxisFormat);
  } else {
    var yAxis = d3.axisLeft(y)
    .tickFormat(yAxisFormat);
  }  

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

  if(median != undefined && q3 != undefined && q1 != undefined) {
    d3.select("#boxPlot" + i).select("g.y.axis").remove()
    d3.select("#boxPlot" + i).selectAll("rect").remove()
    d3.select("#boxPlot" + i).selectAll("line").remove()
    d3.select("#boxPlot" + i).selectAll("toto").remove()
    d3.select("#boxPlot" + i).selectAll("text").remove()
    // Show the box
    // Show the first box (sopra la linea median)
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);

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
      .classed("toto",true);
    
    // Show the upper vertical line
    svg
      .append("line")
      .attr("x1", center)
      .attr("x2", center)
      .attr("y1", y(min))
      .attr("y2", y(q1)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("down", true);

    // Show the lower vertical line
    svg
      .append("line")
      .attr("x1", center)
      .attr("x2", center)
      .attr("y1", y(q3)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("y2", y(max))
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("up", true);
    
    // Rettangolo parte alta 
    svg.append("rect")
      .attr("x", center - width / 2)
      .attr("y", y(max))
      .attr("height", y(q3) - y(max))  // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", width)
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 164, 0,0)")
      .on("click", clickRect);

    // Show the second box (sotto la linea median)
    svg.append("rect")
      .attr("x", center - width / 2)
      .attr("y", y(q1))
      .attr("height", y(min) - y(q1))  // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", width)
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 164, 0,0)")
      .on("click", clickRect);  
  }
  // Aggiungi un titolo sopra il boxplot
  var titleFontSize = 15;

  svg.append("text")
    .attr("x", width)  // Posizione x al centro del grafico
    .attr("y", -10)  // Posizione y sopra il boxplot, regolabile in base alle tue esigenze
    .attr("text-anchor", "middle")  // Allinea il testo al centro
    .style("font-size", titleFontSize + "px")
    .text(title);
}

export { populateBoxplots };