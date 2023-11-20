import "https://d3js.org/d3.v5.min.js";
import "./interface.js";

let ListPlayStoreData = [];
main();

function main() {
  createBoxPlot(1);
}
function createBoxPlot(i) {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 420 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#boxPlot" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 10, left: 40 },
    width = 460 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;
// Show the X scale
    var x = d3.scaleBand().range([0, width]).domain(["setosa", "versicolor", "virginica"]).paddingInner(1).paddingOuter(0.5);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Show the Y scale
    var y = d3.scaleLinear().domain([4, 9]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
  // Read the data and compute summary statistics for each specie
  d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then((data) => {
    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3
      .nest() // nest function allows to group the calculation per level of a factor
      .key(function (d) {
        return d.Species;
      })
      .rollup(function (d) {
        var q1 = d3.quantile(
          d
            .map(function (g) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.25
        );
        var median = d3.quantile(
          d
            .map(function (g) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.5
        );
        var q3 = d3.quantile(
          d
            .map(function (g) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.75
        );
        var interQuantileRange = q3 - q1;
        var min = q1 - 1.5 * interQuantileRange;
        var max = q3 + 1.5 * interQuantileRange;
        return { q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max };
      })
      .entries(data);

    

    // Show the main vertical line
    svg
      .selectAll("vertLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.key);
      })
      .attr("x2", function (d) {
        return x(d.key);
      })
      .attr("y1", function (d) {
        return y(d.value.min);
      })
      .attr("y2", function (d) {
        return y(d.value.max);
      })
      .attr("stroke", "black")
      .style("width", 40);

    // rectangle for the main box
    var boxWidth = 100;
    svg
      .selectAll("boxes")
      .data(sumstat)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.key) - boxWidth / 2;
      })
      .attr("y", function (d) {
        return y(d.value.q3);
      })
      .attr("height", function (d) {
        return y(d.value.q1) - y(d.value.q3);
      })
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", "#FFA400");

    // Show the median
    svg
      .selectAll("medianLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.key) - boxWidth / 2;
      })
      .attr("x2", function (d) {
        return x(d.key) + boxWidth / 2;
      })
      .attr("y1", function (d) {
        return y(d.value.median);
      })
      .attr("y2", function (d) {
        return y(d.value.median);
      })
      .attr("stroke", "white")
      .style("width", 80);

    // Add individual points with jitter
    var jitterWidth = 50;
    svg
      .selectAll("indPoints")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.Species) - jitterWidth / 2 + Math.random() * jitterWidth;
      })
      .attr("cy", function (d) {
        return y(d.Sepal_Length);
      })
      .attr("r", 4)
      .style("fill", "rgb(255, 164, 0,0.5)")
      .attr("stroke", "#202124");
    
   
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
  updateChart()

  // Function that is triggered when brushing is performed
  function updateChart() {
    if (d3.event != null && d3.event.selection != null) {
      var extent = d3.event.selection

    // Se il brushing è vuoto, reimposta la classe e interrompi la funzione
    if (!extent) {
      svg.selectAll(".selectedBoxPlot").classed("selectedBoxPlot", true);
      return;
    }
    // Imposta la classe "selected" per i cerchi all'interno della selezione del brushing
    svg.selectAll("indPoints").classed("selectedBoxPlot", function (d) {
      var cx = x(d.GrLivArea);
      var cy = y(d.SalePrice);
      if (cx >= extent[0][0] && cx <= extent[1][0] && cy >= extent[0][1] && cy <= extent[1][1])
        //d is in the bruch
        return true
      else
        return false;
    });
    }
    
  }
}
