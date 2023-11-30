import { getAllDataPCA, getMaxInstalls, getMaxReview } from "./ajaxService.js";
import * as commonService from "./commonService.js";

let scaleColor;
let numberOfBrush = 0;
let secondSet = []
let firstSet = []

function createScatterPlot(jsonPCAData) {
  var x;
  var y;
  scaleColor = commonService.getScaleColor();

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 20, bottom: 20, left: 80 },
    width = 768 - margin.left - margin.right,
    height = 330 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#scatterPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(
    d3
      .brush() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart)
      .on("end", createRect) // Each time the brush selection changes, trigger the 'updateChart' function
  );
  // Create scales with log transformation for x and y axes
  x = d3
    .scaleLog()
    .domain([
      1,
      d3.max(jsonPCAData, function (d) {
        return d.Y1;
      }) + 10,
    ])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(0).tickFormat(function(d) { return ""; }));
  // Add Y axis
  y = d3
    .scaleLog()
    .domain([
      1,
      d3.max(jsonPCAData, function (d) {
        return d.Y2;
      }) + 10,
    ])
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y).ticks(0).tickFormat(function(d) { return ""; }));

  populateChart(jsonPCAData, false);

  // Function that is triggered when brushing is performed
  function updateChart(force) {
    if (d3.event != null && d3.event.selection != null) {
      var extent = d3.event.selection;
      // Se il brushing è vuoto, reimposta la classe e interrompi la funzione
      if (!extent) {
        svg.selectAll(".selectedScatterPlot").classed("selectedScatterPlot", true);
        return;
      }
      // Imposta la classe "selected" per i cerchi all'interno della selezione del brushing
      let selectedSet = [];
      svg.selectAll("circle").classed("selectedScatterPlot", function (d) {
        var cx = x(d.Y1);
        var cy = y(d.Y2);
        if (cx >= extent[0][0] && cx <= extent[1][0] && cy >= extent[0][1] && cy <= extent[1][1] ) {
          //d is in the bruch
          selectedSet.push(d);
          return true;
        }
        else if (isInsideRect(d)) return true
        else return false;
      });
      // Aggiungi il rettangolo di selezione
      // svg.selectAll(".brush").remove(); // Rimuovi eventuali rettangoli di selezione precedenti
      // if (d3.event && d3.event.selection) {
      //imposto il primo set di punti selezionati
       if (numberOfBrush == 0) {
        commonService.setFirstSet(selectedSet);
         firstSet = selectedSet
         
      } 
      else if (numberOfBrush == 1) {
        commonService.setSecondSet(selectedSet);
        secondSet = selectedSet
       
      } 
      if (numberOfBrush > 1) {
        svg.selectAll(".brush").remove(); // Rimuovi eventuali rettangoli di selezione precedenti
        svg.selectAll(".selectedScatterPlot").classed("selectedScatterPlot", false);
        numberOfBrush = 0;
        commonService.setFirstSet([])
        commonService.setSecondSet([])
        firstSet = []
        secondSet = []
      }
    }
    if (force) svg.selectAll("circle").classed("selectedScatterPlot", true);
  }
  function createRect() {
    if (d3.event != null && d3.event.selection != null) {
      svg
        .append("rect")
        .attr("class", "brush")
        .attr("fill", "rgba(255, 0, 0, 0.1)")
        .attr("stroke-width", "1px")
        .attr("stroke", "white")
        .attr("color", "trasparent") // Colore del rettangolo di selezione
        .attr("x", d3.event.selection[0][0])
        .attr("y", d3.event.selection[0][1])
        .attr("width", d3.event.selection[1][0] - d3.event.selection[0][0])
        .attr("height", d3.event.selection[1][1] - d3.event.selection[0][1]);
      numberOfBrush++;
      console.log(firstSet)
      console.log(secondSet)
      console.log("cacca");
    }
  }
  function getColor(d) {
    return scaleColor(d.Category);
  }
  function populateChart(data, force) {
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .classed("selectedScatterPlot", true)
      .attr("cx", function (d) {
        return x(d.Y1);
      })
      .attr("cy", function (d) {
        return y(d.Y2);
      })
      .attr("r", 2)
      .style("fill", getColor);
  }

  function isInsideRect(d) {
    let res = false
    if (firstSet != null) {
      res = res || firstSet.includes(d)
    }
    else if (secondSet != null) {
      res = res || secondSet.includes(d)
    }
    
    return res
  }
  
}

export { createScatterPlot };
