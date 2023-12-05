import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";
let selections = new Map();

function populateBoxplots(data) {
  let data1 = data.map((item) => item.Rating);
  createBoxPlot(data1, 1, "Rating");
  let data2 = data.map((item) => item.Reviews);
  createBoxPlot(data2, 2, "Reviews");
  let data3 = data.map((item) => item.Installs);
  createBoxPlot(data3, 3, "Installs");
  let data4 = data.map((item) => item.Size);
  createBoxPlot(data4, 4, "Size");
}

function createBoxPlot(data, i, title) {
  // set the dimensions and margins of the graph
  var divWidth = d3.select(".BoxPlotdiv" + i).node().clientWidth;
  var divHeigth = d3.select(".BoxPlotdiv" + i).node().clientHeight;
  var margin = { top: 25, right: 0, bottom: 5, left: 40 },
    width = divWidth - margin.left - margin.right,
    height = divHeigth - margin.top - margin.bottom;

  d3.select("#boxPlot" + i)
    .select("svg.svgBoxPlot")
    .remove();
  var svg = d3
    .select("#boxPlot" + i)
    .select("svg")
    .select("g.gBoxPlot");

  if (svg.empty()) {
    svg = d3
      .select("#boxPlot" + i)
      .append("svg")
      .attr("width", divWidth - 1)
      .attr("height", divHeigth - 1)
      .append("g")
      .attr("class", "gBoxPlot")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  // append the svg object to the body of the page
  d3.select("#boxPlot" + i)
    .selectAll("g.x.axis")
    .remove();
  // Compute summary statistics used for the box:
  if (data.length != 0) {
    var data_sorted = data.sort(d3.ascending);
    var q1 = d3.quantile(data_sorted, 0.25);
    var median = d3.quantile(data_sorted, 0.5);
    var q3 = d3.quantile(data_sorted, 0.75);
    var interQuantileRange = q3 - q1;
    var min = d3.min(data_sorted);
    var max = d3.max(data_sorted);
  } else {
    var min = 1;
    var max = 1000000;
  }

  // Show the Y scale
  if (max - min < 10)
    var y = d3.scaleLinear().domain([min, max]).range([height, 0]);
  else var y = d3.scaleLog().domain([1, max]).range([height, 0]);

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

  // a few features for the box
  var center = 200;
  var width = 100;

  var clickRect = function (d) {
    var isSelected = d3.select(this).classed("selectedBoxPlotRect");
    var yInverted = y.invert;
    let rangeMin = yInverted(
      +this.attributes.y.value + +this.attributes.height.value
    );
    let rangeMax = yInverted(+this.attributes.y.value);
    let titleValue;
    if (isSelected) {
      d3.select(this).classed("selectedBoxPlotRect", false);
      titleValue = selections.get(title);
      for (let i = 0; i < titleValue.length; i++) {
        const element = titleValue[i];
        if (element[0] == rangeMin && element[1] == rangeMax) {
          titleValue.splice(i, 1);
          if (titleValue.length == 0) selections.delete(title);
          break;
        }
      }
    } else {
      titleValue = selections.get(title);
      if (titleValue != undefined) {
        titleValue.push([rangeMin, rangeMax]);
      } else {
        titleValue = [[rangeMin, rangeMax]];
      }
      selections.set(title, titleValue);
      d3.select(this).classed("selectedBoxPlotRect", true);
    }
    addBorderToCircleSelected();
  };
  var clickInvRect = function (d) {
    var isSelected = d3.select(this).classed("selectedInvisibleBoxPlotRect");
    var yInverted = y.invert;
    let rangeMin = yInverted(
      +this.attributes.y.value + +this.attributes.height.value
    );
    let rangeMax = yInverted(+this.attributes.y.value);
    let titleValue;
    if (isSelected) {
      d3.select(this).classed("selectedInvisibleBoxPlotRect", false);
      d3.select(this).classed("selectedBoxPlotRect", false);
      titleValue = selections.get(title);
      for (let i = 0; i < titleValue.length; i++) {
        const element = titleValue[i];
        if (element[0] == rangeMin && element[1] == rangeMax) {
          titleValue.splice(i, 1);
          if (titleValue.length == 0) selections.delete(title);
          break;
        }
      }
    } else {
      titleValue = selections.get(title);
      if (titleValue != undefined) {
        titleValue.push([rangeMin, rangeMax]);
      } else {
        titleValue = [[rangeMin, rangeMax]];
      }
      selections.set(title, titleValue);
      d3.select(this).classed("selectedInvisibleBoxPlotRect", true);
      d3.select(this).classed("selectedBoxPlotRect", true);
    }
    addBorderToCircleSelected();
  };

  if (median != undefined && q3 != undefined && q1 != undefined) {
    d3.select("#boxPlot" + i)
      .select("g.y.axis")
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
    // Show the box
    // Show the first box (sopra la linea median)
    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);

    svg
      .append("rect")
      .classed(title, true)
      .classed("rectUp", true)
      .attr("x", center - width / 2)
      .attr("y", y(q3))
      .attr("height", y(median) - y(q3)) // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", width)
      .attr("stroke", "black")
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 164, 0)")
      .style("opacity", 0.5)
      .on("click", clickRect);

    // Show the second box (sotto la linea median)
    svg
      .append("rect")
      .classed(title, true)
      .classed("rectDown", true)
      .attr("x", center - width / 2)
      .attr("y", y(median))
      .attr("height", y(q1) - y(median)) // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", width)
      .attr("stroke", "black")
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 164, 0)")
      .style("opacity", 0.5)
      .on("click", clickRect);

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
      .classed("toto", true);

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
    svg
      .append("rect")
      .classed(title, true)
      .classed("rectUpOver", true)
      .attr("x", center - width / 2)
      .attr("y", y(max))
      .attr("height", y(q3) - y(max)) // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", width)
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 164, 0)")
      .style("opacity", 0)
      .on("click", clickInvRect);

    // Show the second box (sotto la linea median)
    svg
      .append("rect")
      .classed(title, true)
      .classed("rectDownOver", true)
      .attr("x", center - width / 2)
      .attr("y", y(q1))
      .attr("height", y(min) - y(q1)) // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", width)
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 164, 0)")
      .style("opacity", 0)
      .on("click", clickInvRect);
  }
  if (data.length == 0) {
    d3.select("#boxPlot" + i)
      .select("g.y.axis")
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
    // Show the box
    // Show the first box (sopra la linea median)
    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);
  }
  // Aggiungi un titolo sopra il boxplot
  var titleFontSize = 15;

  svg
    .append("text")
    .attr("x", width) // Posizione x al centro del grafico
    .attr("y", -10) // Posizione y sopra il boxplot, regolabile in base alle tue esigenze
    .attr("text-anchor", "middle") // Allinea il testo al centro
    .style("font-size", titleFontSize + "px")
    .text(title);
}
//TODO controllare se era selezionato e gestire
function addBorderToCircleSelected() {
  d3.select("#scatterPlot")
    .selectAll("circle.selectedScatterPlot")
    .each(function (d) {
      let isActive =
        selections.size > 0
          ? Array.from(selections).every(([title, listRange]) => {
              let ris = true;
              for (let i = 0; i < listRange.length; i++) {
                const element = listRange[i];
                let rangeMin = element[0];
                let rangeMax = element[1];
                ris = ris && d[title] >= rangeMin && d[title] <= rangeMax;
              }
              return ris;
            })
          : false;
      if (isActive)
        d3.select(this)
          .classed("selectedScatterPlot", false)
          .classed("selectedScatterPlotFilteredBoxPlot", true);
      else
        d3.select(this)
          .classed("selectedScatterPlotFilteredBoxPlot", false)
          .classed("selectedScatterPlot", true);
    });
}
export { populateBoxplots };
