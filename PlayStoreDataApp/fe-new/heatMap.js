import "./interface.js";

let ListPlayStoreData = [];
main();

function main() {
  createHeatMap();
}

function createHeatMap() {
  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 5, bottom: 20, left: 40 },
    width = 783 - margin.left - margin.right,
    height = 310 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#heatMap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Labels of row and columns
  var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

  // // Build X scales and axis:
  // var x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
  // svg
  //   .append("g")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x));

  // // Build X scales and axis:
  // var y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
  // svg.append("g").call(d3.axisLeft(y));
  // Build X scales and axis:
  var x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
  svg
    .append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain")
    .remove();

  // Build Y scales and axis:
  var y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.05);
  svg.append("g").style("font-size", 15).call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();
  // Build color scale
  var myColor = d3.scaleLinear().range(["#202124", "#FFA400"]).domain([1, 100]);

  //Read the data
  d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then((data) => {
    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    var myGroups = d3
      .map(data, function (d) {
        return d.group;
      })
      .keys();
    var myVars = d3
      .map(data, function (d) {
        return d.variable;
      })
      .keys();

    // // Build color scale
    // var myColor = d3.scaleSequential().interpolator(d3.interpolateInferno).domain([1, 100]);

    // create a tooltip
    var tooltip = d3
      .select("#heatMap")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("color", "black")
      .style("border", "solid white")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("stroke", "white").style("opacity", 1);
    };
    var mousemove = function (d) {
      tooltip
        .html("The exact value of<br>this cell is: " + d.value)

        .style("left", d3.mouse(this)[0] + 70 + "px")
        .style("top", d3.mouse(this)[1] + 300 + "px");
    };
    var mouseleave = function (d) {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none").style("opacity", 0.8);
    };
    //Permette di aggingere alla selezione i valori nell'heatmap
    var click = function (d) {
      var isSelected = d3.select(this).classed("selectedHeatMap");
      console.log(d)
      // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
      if (isSelected) {
        d3.select(this).classed("selectedHeatMap", false);
      } else {
        d3.select(this).classed("selectedHeatMap", true);
      }

    };
    // add the squares
    svg
      .selectAll()
      .data(data, function (d) {
        return d.group + ":" + d.variable;
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.group);
      })
      .attr("y", function (d) {
        return y(d.variable);
      })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) {
        return myColor(d.value);
      })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", click);
  });


  // svg
  //   .selectAll()
  //   .data(data, function (d) {
  //     return d.group + ":" + d.variable;
  //   })
  //   .enter()
  //   .append("rect")
  //   .attr("x", function (d) {
  //     return x(d.group);
  //   })
  //   .attr("y", function (d) {
  //     return y(d.variable);
  //   })
  //   .attr("width", x.bandwidth())
  //   .attr("height", y.bandwidth())
  //   .style("fill", function (d) {
  //     return myColor(d.value);
  //   });
}
