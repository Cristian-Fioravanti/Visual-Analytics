import "./interface.js";

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

  // Add X axis
  const x = d3.scaleLinear().domain([0, 4000]).range([0, width]);
  svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 500000]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));
  //Read the data
  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv").then(function (data) {
    data.GrLivArea = parseInt(data.GrLivArea);
    data.SalePrice = parseInt(data.SalePrice);
    // Add dots
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", function (d) {
        return x(d.GrLivArea);
      })
      .attr("cy", function (d) {
        return y(d.SalePrice);
      })
      .attr("r", 1.5)
      .style("fill", "rgb(255, 164, 0, 0.5)");
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
  updateChart();

  // Function that is triggered when brushing is performed
  function updateChart() {
    if (d3.event != null && d3.event.selection != null) {
      var extent = d3.event.selection;
      // Se il brushing è vuoto, reimposta la classe e interrompi la funzione
    if (!extent) {
      svg.selectAll(".selectedScatterPlot").classed("selectedScatterPlot", true);
      return;
    }
    // Imposta la classe "selected" per i cerchi all'interno della selezione del brushing
    svg.selectAll("circle").classed("selectedScatterPlot", function (d) {
      var cx = x(d.GrLivArea);
      var cy = y(d.SalePrice);
      if (cx >= extent[0][0] && cx <= extent[1][0] && cy >= extent[0][1] && cy <= extent[1][1])
        //d is in the bruch
        return true;
      else return false;
    });
    } 

    
  }
}
