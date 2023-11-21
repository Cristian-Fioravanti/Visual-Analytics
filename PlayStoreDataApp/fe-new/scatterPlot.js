import {getAllData, getMaxInstalls, getMaxReview} from "./interface.js";

let ListPlayStoreData = [];
main();

function main() {
  createScatterPlot();
}

function createScatterPlot() {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 20, bottom: 20, left: 55 },
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

  var x
  var y 
  var json_dati
  var max_Installs
  var max_Reviews

  getAllData()
    .done(function(jsonData) {
      console.log('Dati ottenuti:', jsonData);
      json_dati = jsonData
      getMaxReview().done(function(jsonData) {
        console.log('Dati ottenuti:', jsonData[0]['MAX(Reviews)']);
        max_Reviews = jsonData[0]['MAX(Reviews)']
        // Add X axis
        x = d3.scaleLinear().domain([0, max_Reviews]).range([0, width]);
        svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
        getMaxInstalls().done(function(jsonData) {
          console.log('Dati ottenuti:', jsonData[0]['MAX(Installs)']);
          max_Installs = jsonData[0]['MAX(Installs)']
          // Add Y axis
          y = d3.scaleLinear().domain([0, max_Installs]).range([height, 0]);
          svg.append("g").call(d3.axisLeft(y));
          populateChart(json_dati)
        })
      })
    });  

  svg.call(
    d3
      .brush() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
  );

  // Function that is triggered when brushing is performed
  function updateChart() {
      
    var extent = d3.event.selection
    var data = []
    // Se il brushing è vuoto, reimposta la classe e interrompi la funzione
    if (!extent) {
      svg.selectAll(".selectedScatterPlot").classed("selectedScatterPlot", true);
      return;
    }
    // Imposta la classe "selected" per i cerchi all'interno della selezione del brushing
    svg.selectAll("circle").classed("selectedScatterPlot", function (d) {
      var cx = x(d.Reviews);
      var cy = y(d.Installs);
      if (cx >= extent[0][0] && cx <= extent[1][0] && cy >= extent[0][1] && cy <= extent[1][1]) {
        //d is in the bruch
        return true
      } else
        return false;
    });
  }

  function populateChart(data) {
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", function (d) {
        return x(d.Reviews);
      })
      .attr("cy", function (d) {
        return y(d.Installs);
      })
      .attr("r", 1.5)
      .style("fill", "rgb(255, 164, 0, 0.5)");
  }
}
