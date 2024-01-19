import "https://d3js.org/d3.v5.min.js";
import * as commonService from "./commonService.js";
import * as categoryService from "./category.js";

function populateBoxplots() {
  initializeMultiBoxPlot();
  commonService.firstSet.observe((data) => {
    if (commonService.mode.value == "Compare") {
      var newData = commonService.firstSet.value;
      var secondGroup = commonService.secondSet.value;
      if (categoryService.firstCategory != null) {
        var group1 = categoryService.firstCategory;
      } else {
        var group1 = "Group 1";
      }
      if (categoryService.secondCategory != null) {
        var group2 = categoryService.secondCategory;
      } else {
        var group2 = "Group 2";
      }
      let data1 = newData.map((item) => item.Rating);
      let data11 =
        secondGroup != undefined ? secondGroup.map((item) => item.Rating) : [];
      createBoxPlot(data1, data11, 1, "Ratings", group1, group2);
      let data2 = newData.map((item) => item.Reviews);
      let data21 =
        secondGroup != undefined ? secondGroup.map((item) => item.Reviews) : [];
      createBoxPlot(data2, data21, 2, "Reviews", group1, group2);
      let data3 = newData.map((item) => item.Installs);
      let data31 =
        secondGroup != undefined
          ? secondGroup.map((item) => item.Installs)
          : [];
      createBoxPlot(data3, data31, 3, "Installs", group1, group2);
      let data4 = newData.map((item) => item.Size);
      let data41 =
        secondGroup != undefined ? secondGroup.map((item) => item.Size) : [];
      createBoxPlot(data4, data41, 4, "Size", group1, group2);
    }
  });
  commonService.secondSet.observe((data) => {
    if (commonService.mode.value == "Compare") {
      var newData = commonService.secondSet.value;
      var firstGroup = commonService.firstSet.value;
      if (categoryService.firstCategory != null) {
        var group1 = categoryService.firstCategory;
      } else {
        var group1 = "Group 1";
      }
      if (categoryService.secondCategory != null) {
        var group2 = categoryService.secondCategory;
      } else {
        var group2 = "Group 2";
      }
      let data1 = newData.map((item) => item.Rating);
      let data11 =
        firstGroup != undefined ? firstGroup.map((item) => item.Rating) : [];
      createBoxPlot(data11, data1, 1, "Ratings", group1, group2);
      let data2 = newData.map((item) => item.Reviews);
      let data21 =
        firstGroup != undefined ? firstGroup.map((item) => item.Reviews) : [];
      createBoxPlot(data21, data2, 2, "Reviews", group1, group2);
      let data3 = newData.map((item) => item.Installs);
      let data31 =
        firstGroup != undefined ? firstGroup.map((item) => item.Installs) : [];
      createBoxPlot(data31, data3, 3, "Installs", group1, group2);
      let data4 = newData.map((item) => item.Size);
      let data41 =
        firstGroup != undefined ? firstGroup.map((item) => item.Size) : [];
      createBoxPlot(data41, data4, 4, "Size", group1, group2);
    }
  });
}

function createBoxPlot(data1, data2, i, title, group1, group2) {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 0, bottom: 25, left: 70 },
    width = 298 - margin.left - margin.right,
    height = 167 - margin.top - margin.bottom;

  var svg = d3.select("#boxPlot" + i).select("svg");
  if (svg.empty()) {
    svg = d3
      .select("#boxPlot" + i)
      .append("svg")
      .attr("class", "svgBoxPlot")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  if (data1.length != 0) {
    var data_sorted1 = data1.sort(d3.ascending);
    var q11 = d3.quantile(data_sorted1, 0.25);
    var median1 = d3.quantile(data_sorted1, 0.5);
    var q31 = d3.quantile(data_sorted1, 0.75);
    var min1 = d3.min(data_sorted1);
    var max1 = d3.max(data_sorted1);
  }
  if (data2.length != 0) {
    var data_sorted2 = data2.sort(d3.ascending);
    var q12 = d3.quantile(data_sorted2, 0.25);
    var median2 = d3.quantile(data_sorted2, 0.5);
    var q32 = d3.quantile(data_sorted2, 0.75);
    var min2 = d3.min(data_sorted2);
    var max2 = d3.max(data_sorted2);
  }
  if (data1.length != 0 && data2.length != 0) {
    var groupedData = data1.concat(data2);
    var min = d3.min(groupedData);
    var max = d3.max(groupedData);
  } else if (data1.length != 0 && data2.length == 0) {
    var min = d3.min(data_sorted1);
    var max = d3.max(data_sorted1);
  } else if (data1.length == 0 && data2.length != 0) {
    var min = d3.min(data_sorted2);
    var max = d3.max(data_sorted2);
  } else {
    var min = 1;
    var max = 1000000;
  }
  // Show the Y scale
  if (max - min < 10)
    var y = d3
      .scaleLinear()
      .domain([min, max])
      .range([height + margin.top, margin.bottom]);
  else
    var y = d3
      .scaleLog()
      .domain([1, max])
      .range([height + margin.top, margin.bottom]);

  // Show the X scale
  var x = d3
    .scaleBand()
    .range([margin.left, width + margin.left])
    .domain([group1, group2]);
  var xAxis = d3.axisBottom(x).tickSize(8);

  // Y Scale
  var powerLabels = d3
    .range(0, Math.ceil(Math.log10(max) + 1))
    .map(function (d) {
      return Math.pow(10, d);
    });
  var yAxisFormat = d3.format("");
  if (max > 10) {
    var yAxis = d3.axisLeft(y).tickValues(powerLabels).tickFormat(yAxisFormat);
  } else {
    var yAxis = d3.axisLeft(y).tickFormat(yAxisFormat);
  }

  var boxWidth = 75;

  if (median1 != undefined && q31 != undefined && q11 != undefined) {
    d3.select("#boxPlot" + i)
      .select("g.y.axis")
      .remove();
    d3.select("#boxPlot" + i)
      .select("g.xAxis")
      .remove();
    d3.select("#boxPlot" + i)
      .selectAll("rect")
      .remove();
    d3.select("#boxPlot" + i)
      .selectAll("line")
      .remove();
    d3.select("#boxPlot" + i)
      .selectAll("toto")
      .remove();
    d3.select("#boxPlot" + i)
      .selectAll("text")
      .remove();

    var color =
      group1 == "Group 1" ? "#cb2322" : commonService.scaleColor(group1);
    var newTopX = height + margin.top;
    svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(" + 0 + "," + newTopX + ")")
      .call(xAxis);
    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + "," + 0 + ")")
      .call(yAxis);

    svg
      .append("rect")
      .attr("x", x(group1) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("y", y(q31))
      .attr("height", y(median1) - y(q31)) // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", color)
      .style("opacity", 1);

    // Show the second box (sotto la linea median)
    svg
      .append("rect")
      .attr("x", x(group1) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("y", y(median1))
      .attr("height", y(q11) - y(median1)) // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", color)
      .style("opacity", 1);

    // show median, min and max horizontal lines
    svg
      .selectAll("toto")
      .data([min1, median1, max1])
      .enter()
      .append("line")
      .attr("x1", x(group1) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("x2", x(group1) + boxWidth / 2 + x.bandwidth() / 2)
      .attr("y1", function (d) {
        return y(d);
      })
      .attr("y2", function (d) {
        return y(d);
      })
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

    // Show the upper vertical line
    svg
      .append("line")
      .attr("x1", x(group1) + x.bandwidth() / 2)
      .attr("x2", x(group1) + x.bandwidth() / 2)
      .attr("y1", y(min1))
      .attr("y2", y(q11)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("down", true);

    // Show the lower vertical line
    svg
      .append("line")
      .attr("x1", x(group1) + x.bandwidth() / 2)
      .attr("x2", x(group1) + x.bandwidth() / 2)
      .attr("y1", y(q31)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("y2", y(max1))
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("up", true);

    // Rettangolo parte alta
    svg
      .append("rect")
      .attr("x", x(group1) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("y", y(max1))
      .attr("height", y(q31) - y(max1)) // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", boxWidth)
      .style("fill", color)
      .style("opacity", 0);

    // Show the second box (sotto la linea median)
    svg
      .append("rect")
      .attr("x", x(group1) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("y", y(q11))
      .attr("height", y(min1) - y(q11)) // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", boxWidth)
      .style("fill", color)
      .style("opacity", 0);
  }
  if (median2 != undefined && q32 != undefined && q12 != undefined) {
    if (median1 == undefined || q31 == undefined || q11 == undefined) {
      d3.select("#boxPlot" + i)
        .select("g.y.axis")
        .remove();
      d3.select("#boxPlot" + i)
        .select("g.xAxis")
        .remove();
      d3.select("#boxPlot" + i)
        .selectAll("rect")
        .remove();
      d3.select("#boxPlot" + i)
        .selectAll("line")
        .remove();
      d3.select("#boxPlot" + i)
        .selectAll("toto")
        .remove();
      d3.select("#boxPlot" + i)
        .selectAll("text")
        .remove();

      var newTopX = height + margin.top;
      svg
        .append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(" + 0 + "," + newTopX + ")")
        .call(xAxis);
      // Show the box
      // Show the first box (sopra la linea median)
      svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .call(yAxis);
    }
    var color =
      group2 == "Group 2" ? "#00e3fd" : commonService.scaleColor(group2);
    svg
      .append("rect")
      .attr("x", x(group2) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("y", y(q32))
      .attr("height", y(median2) - y(q32)) // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", color)
      .style("opacity", 1);

    // Show the second box (sotto la linea median)
    svg
      .append("rect")
      .attr("x", x(group2) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("y", y(median2))
      .attr("height", y(q12) - y(median2)) // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", color)
      .style("opacity", 1);

    // show median, min and max horizontal lines
    svg
      .selectAll("toto")
      .data([min2, median2, max2])
      .enter()
      .append("line")
      .attr("x1", x(group2) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("x2", x(group2) + boxWidth / 2 + x.bandwidth() / 2)
      .attr("y1", function (d) {
        return y(d);
      })
      .attr("y2", function (d) {
        return y(d);
      })
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

    // Show the lower vertical line
    svg
      .append("line")
      .attr("x1", x(group2) + x.bandwidth() / 2)
      .attr("x2", x(group2) + x.bandwidth() / 2)
      .attr("y1", y(min2))
      .attr("y2", y(q12)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("down", true);

    // Show the upper vertical line
    svg
      .append("line")
      .attr("x1", x(group2) + x.bandwidth() / 2)
      .attr("x2", x(group2) + x.bandwidth() / 2)
      .attr("y1", y(q32)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("y2", y(max2))
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("up", true);

    // Rettangolo parte alta
    svg
      .append("rect")
      .attr("x", x(group2) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("y", y(max2))
      .attr("height", y(q32) - y(max2)) // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", boxWidth)
      .style("fill", color)
      .style("opacity", 0);

    // Show the second box (sotto la linea median)
    svg
      .append("rect")
      .attr("x", x(group2) - boxWidth / 2 + x.bandwidth() / 2)
      .attr("y", y(q12))
      .attr("height", y(min2) - y(q12)) // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", boxWidth)
      .style("fill", color)
      .style("opacity", 0);
  }
  if (data1.length == 0 && data2.length == 0) {
    d3.select("#boxPlot" + i)
      .select("g.y.axis")
      .remove();
    d3.select("#boxPlot" + i)
      .select("g.xAxis")
      .remove();
    d3.select("#boxPlot" + i)
      .selectAll("rect")
      .remove();
    d3.select("#boxPlot" + i)
      .selectAll("line")
      .remove();
    d3.select("#boxPlot" + i)
      .selectAll("toto")
      .remove();
    d3.select("#boxPlot" + i)
      .selectAll("text")
      .remove();
    var newTopX = height + margin.top;
    svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(" + 0 + "," + newTopX + ")")
      .call(xAxis);
    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + "," + 0 + ")")
      .call(yAxis);
  }

  // Aggiungi un titolo sopra il boxplot
  var titleFontSize = 15;

  svg
    .append("text")
    .attr("x", x(group1) + x.bandwidth() / 2) // Posizione x al centro del grafico
    .attr("y", 15) // Posizione y sopra il boxplot, regolabile in base alle tue esigenze
    .attr("text-anchor", "middle") // Allinea il testo al centro
    .style("font-size", titleFontSize + "px")
    .text(title);
}

function initializeMultiBoxPlot() {
  createBoxPlot([], [], 1, "Ratings", "Group 1", "Group 2");
  createBoxPlot([], [], 1, "Ratings", "Group 1", "Group 2");
  createBoxPlot([], [], 2, "Reviews", "Group 1", "Group 2");
  createBoxPlot([], [], 2, "Reviews", "Group 1", "Group 2");
  createBoxPlot([], [], 3, "Installs", "Group 1", "Group 2");
  createBoxPlot([], [], 3, "Installs", "Group 1", "Group 2");
  createBoxPlot([], [], 4, "Size", "Group 1", "Group 2");
  createBoxPlot([], [], 4, "Size", "Group 1", "Group 2");
}

export { populateBoxplots };
