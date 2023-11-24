import { getAllDataPCA, getMaxInstalls, getMaxReview } from "./ajaxService.js";

let ListPlayStoreData = [];
main();

function main() {
  createScatterPlot();
}

function createScatterPlot() {
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

  var x;
  var y;
  var json_dati;
  var max_Installs;
  var max_Reviews;

  getAllDataPCA().done(function (jsonData) {
    console.log("Dati ottenuti:", jsonData);
    json_dati = jsonData;

    // Create scales with log transformation for x and y axes    
    x = d3.scaleLog()
        .domain([1,d3.max(jsonData, function(d) { return d.Y1; })+10])
        .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    y = d3.scaleLog()
        .domain([1, d3.max(jsonData, function(d) { return d.Y2; })+10])
        .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    populateChart(json_dati, true);
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
  updateChart(false);

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
      svg.selectAll("circle").classed("selectedScatterPlot", function (d) {
        var cx = x(d.Y1);
        var cy = y(d.Y2);
        if (cx >= extent[0][0] && cx <= extent[1][0] && cy >= extent[0][1] && cy <= extent[1][1])
          //d is in the bruch
          return true;
        else return false;
      });
    }
    if (force) svg.selectAll("circle").classed("selectedScatterPlot", true);
  }

  function populateChart(data, force) {
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", function (d) {
        return x(d.Y1);
      })
      .attr("cy", function (d) {
        return y(d.Y2);
      })
      .attr("r", 1.5)
      .style("fill", "rgb(255, 164, 0, 0.5)");
    updateChart(force);
  }
}
