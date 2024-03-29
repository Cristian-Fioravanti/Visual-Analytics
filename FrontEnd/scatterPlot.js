import * as commonService from "./commonService.js";
import * as ajaxService from "./ajaxService.js";
import * as categoryService from "./category.js";

let scaleColor;
let allData;
export let numberOfBrush = 0;
let secondSet;
let firstSet;
let firstBrush;
let secondBrush;
let brushVar;
let dimensions = ["Rating", "Category", "Reviews", "Size", "Installs", "Price", "Content_Rating", "Type"];
var x;
var y;
var initilizedX;
var initilizedY;
var newX;
var newY;
var zoom;
var divWidth;
var divHeigth;
var globalRecalculated;

export function createScatterPlot(jsonPCAData, recalculated) {
  allData = jsonPCAData;
  globalRecalculated = recalculated;
  var xAxis;
  var yAxis;

  var tooltip;

  numberOfBrush = 0;
  secondSet = [];
  firstSet = [];
  firstBrush = [];
  secondBrush = [];
  scaleColor = commonService.getScaleColor();

  // set the dimensions and margins of the graph
  divWidth = d3.select("#scatterPlot").node().offsetWidth;
  divHeigth = d3.select(".div2").node().clientHeight / 2;
  var margin = { top: 10, right: 0, bottom: 20, left: 0 },
    width = divWidth - margin.left - margin.right,
    height = divHeigth - margin.top - margin.bottom;

  function addTooltip() {
    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    tooltip = d3.select("#scatterPlot").select("div.tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select("#scatterPlot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("position", "absolute")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");
    }
  }
  addTooltip();

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function (d) {
    tooltip.style("opacity", 1).style("display", "block");
  };

  var mousemove = function (d) {
    // Costruisci il contenuto HTML utilizzando i dati da "d"
    var htmlContent = "<strong>App:</strong> " + d.App + "<br>";

    // Aggiungi altri dati da "dimensions" se disponibili
    dimensions.forEach(function (dimension) {
      // Verifica se la dimensione è presente nell'oggetto "d"
      if (d[dimension]) {
        if (dimension == "Category") htmlContent += "<strong '>" + dimension + ":</strong> " + "<label style='color: "+scaleColor(d.Category)+"'>"+d[dimension]+"</label> <br>"
        else
        htmlContent += "<strong>" + dimension + ":</strong> " + d[dimension] + "<br>";
      }
    });
    if (!Array.from(d3.select(this)._groups[0][0].classList).includes("selectedScatterPlot")) {
      htmlContent += "<strong style='color: #cd1919'>Not selected</strong> ";
    } else {
      htmlContent += "<strong style='color: #2ecd19'>Selected</strong> ";
    }

    tooltip
      .html(htmlContent)
      .style("left", d3.mouse(this)[0] + 320 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", d3.mouse(this)[1] + 70 + "px");
  };

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function (d) {
    tooltip.style("opacity", 0).style("display", "none");
  };

  // append the svg object to the body of the page
  var svg = d3.select("#scatterPlot").select("svg").select("g");
  if (svg.empty()) {
    svg = d3
      .select("#scatterPlot")
      .append("svg")
      .attr("width", divWidth - 10)
      .attr("height", divHeigth - 10)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  // Add zoom functionality
  zoom = d3
    .zoom()
    .scaleExtent([-20, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", zoomed);

 function zoomed() {
  // recover the new scale
  newX = d3.event.transform.rescaleX(x);
  newY = d3.event.transform.rescaleY(y);

  // update axes with these new boundaries
  xAxis.call(d3.axisBottom(newX));
  yAxis.call(d3.axisLeft(newY));

  // update circle position
  svg
    .selectAll("circle")
    .attr("cx", function (d) {
      var cx = newX(d.Y1);
      return cx >= 0 && cx <= width ? cx : cx < 0 ? 0 : width;
    })
    .attr("cy", function (d) {
      var cy = newY(d.Y2);
      return cy >= 0 && cy <= height ? cy : cy < 0 ? 0 : height;
    });
}


  brushVar = d3
    .brush() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("start brush", updateChart)
    .on("end", createRect); // Each time the brush selection changes, trigger the 'updateChart' function

  d3.select(".brushRect").remove();
  svg.append("g").attr("class", "brushRect").call(brushVar);

  // Inizializza le variabili di stato per lo zoom e il pennello
  var zoomEnabled = false;
  var brushEnabled = true;
  function updateButtonStyles() {
    // Pulsante Zoom
    var buttonZoom = d3.select("#toggleZoom");
    buttonZoom.classed("active", zoomEnabled);
    buttonZoom.classed("disabled", !zoomEnabled);

    // Pulsante Pennello
    var buttonBrush = d3.select("#toggleBrush");
    buttonBrush.classed("active", brushEnabled);
    buttonBrush.classed("disabled", !brushEnabled);
  }
  function moveLastChildToFirst(parentElement) {
    if (parentElement) {
      var lastChild = parentElement.lastElementChild;

      // Sposta l'ultimo figlio all'inizio
      parentElement.insertBefore(lastChild, parentElement.firstElementChild);
    }
  }
  updateButtonStyles();
  // Inizializza il pulsante per attivare/disattivare lo zoom
  var buttonZoom = d3.select("#toggleZoom");
  buttonZoom.on("click", function (d) {
    // d3.select(".brushRect").remove();
    removeBrush(svg);
    updateChart();
    if (zoomEnabled) {
      // Disattiva lo zoom
      // d3.select(".brushRect").remove();
      d3.select(".zoomRect").remove();
      x = newX;
      y = newY;
    } else {
      // Verifica se il pennello è attivo e disattivalo
      if (brushEnabled) {
        d3.select(".brushRect").remove();
        brushEnabled = false;
      }

      // Attiva lo zoom
      if (d3.select(".zoomRect").empty()) {
        svg
          .append("rect")
          .attr("class", "zoomRect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all")
          .style("cursor", "grab")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(zoom);
        moveLastChildToFirst(svg._groups[0][0]);
      }
    }
    zoomEnabled = !zoomEnabled; // Inverti lo stato dello zoom
    updateButtonStyles();
  });

  // Inizializza il pulsante per attivare/disattivare il pennello
  var buttonBrush = d3.select("#toggleBrush");
  buttonBrush.on("click", function (d) {
    if (commonService.mode.value == "Compare") putAllEmpty(svg);
    if (brushEnabled) {
      // Disattiva il pennello
      d3.select(".brushRect").remove();
    } else {
      // Verifica se lo zoom è attivo e disattivalo
      if (zoomEnabled) {
        d3.select(".zoomRect").remove();
        zoomEnabled = false;
      }

      // Attiva il pennello
      if (newX != undefined && newY != undefined) {
        x = newX;
        y = newY;
      }
      svg.append("g").attr("class", "brushRect").call(brushVar);
      moveLastChildToFirst(svg._groups[0][0]);
    }
    brushEnabled = !brushEnabled; // Inverti lo stato del pennello
    updateButtonStyles();
  });

  // Bottone Compute PCA
  var button = d3.select("#computePCA");
  button
    .on("click", computePCA)
    .on("mouseover", function (d) {
      d3.select("#computePCAImg")._groups[0][0].src = "./scatter-graph-green.png";
    })
    .on("mouseleave", function (d) {
      d3.select("#computePCAImg")._groups[0][0].src = "./scatter-graph.png";
    });

  // Create scales with log transformation for x and y axes
  x = d3
    .scaleSymlog()
    .domain([
      0.8,
      d3.max(jsonPCAData, function (d) {
        return d.Y1;
      }) + 10,
    ])
    .range([0, width]);
  initilizedX = x;
  xAxis = svg.select("g.x.axis");
  if (xAxis.empty()) {
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(
        d3
          .axisBottom(x)
          .ticks(0)
          .tickFormat(function (d) {
            return "";
          })
      );
  } else {
    xAxis.call(
      d3
        .axisBottom(x)
        .ticks(0)
        .tickFormat(function (d) {
          return "";
        })
    );
  }

  // Add Y axis
  y = d3
    .scaleSymlog()
    .domain([
      0.8,
      d3.max(jsonPCAData, function (d) {
        return d.Y2;
      }) + 10,
    ])
    .range([height, 0]);
  initilizedY = y;
  yAxis = svg.select("g.y.axis");
  if (yAxis.empty()) {
    svg
      .append("g")
      .attr("class", "y axis")
      .call(
        d3
          .axisLeft(y)
          // .ticks(0)
          .tickFormat(function (d) {
            return "";
          })
      );
  } else {
    yAxis.remove();
    svg
      .append("g")
      .attr("class", "y axis")
      .call(
        d3
          .axisLeft(y)
          // .ticks(0)
          .tickFormat(function (d) {
            return "";
          })
      );
  }
  populateChart(jsonPCAData, false);

  function createRect() {
    if (d3.event != null && d3.event.selection != null) {
      if (isFirstBrush()) {
        svg
          .append("rect")
          .attr("class", "brush")
          .attr("fill", "rgb(255, 0, 0, 0.1)")
          .attr("stroke-width", "1px")
          .attr("stroke", "white")
          .attr("color", "trasparent") // Colore del rettangolo di selezione
          .attr("x", d3.event.selection[0][0])
          .attr("y", d3.event.selection[0][1])
          .attr("width", d3.event.selection[1][0] - d3.event.selection[0][0])
          .attr("height", d3.event.selection[1][1] - d3.event.selection[0][1]);
        numberOfBrush++;
        firstBrush = firstSet;
      } else {
        svg
          .append("rect")
          .attr("class", "brush")
          .attr("fill", "rgb(0, 0, 255, 0.1)")
          .attr("stroke-width", "1px")
          .attr("stroke", "white")
          .attr("color", "trasparent") // Colore del rettangolo di selezione
          .attr("x", d3.event.selection[0][0])
          .attr("y", d3.event.selection[0][1])
          .attr("width", d3.event.selection[1][0] - d3.event.selection[0][0])
          .attr("height", d3.event.selection[1][1] - d3.event.selection[0][1]);
        numberOfBrush++;
        secondBrush = secondSet;
      }
      moveLastChildToFirst(svg._groups[0][0]);
    }
  }
  function getColor(d) {
    if (recalculated) {
      let group1 = commonService.firstSet.value.map((obj) => obj.ID);
      if (group1.includes(d.ID)) {
        var color = categoryService.firstCategory == null ? scaleColor(d.Category) : commonService.scaleColor(categoryService.firstCategory);
      } else {
        var color = categoryService.secondCategory == null ? scaleColor(d.Category) : commonService.scaleColor(categoryService.secondCategory);
      }
      return color;
    } else {
      return scaleColor(d.Category);
    }
  }

  function populateChart(data, force) {
    svg.select("g.gCircles").remove();
    svg.selectAll("rect.brush").remove();
    svg
      .append("g")
      .attr("class", "gCircles")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("class", function (d) {
        return "selectedScatterPlot " + getBorderGroupClass(d);
      })
      .attr("name", function (d) {
        return d.Category;
      })
      .attr("id", function (d) {
        return +d.ID;
      })
      .attr("cx", function (d) {
        return x(d.Y1);
      })
      .attr("cy", function (d) {
        return y(d.Y2);
      })
      .attr("r", 3)
      .style("fill", getColor)

      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }
}

function isFirstBrush() {
  return (
    (numberOfBrush == 0 && categoryService.numberOfCheckBoxSelected == 0) ||
    (numberOfBrush == 0 && categoryService.numberOfCheckBoxSelected == 1 && commonService.isEmpty(commonService.firstSet)) ||
    (numberOfBrush == 1 && categoryService.numberOfCheckBoxSelected == 0 && firstBrush.length == 0)
  );
}

function computePCA() {
  let firstGroup = commonService.firstSet.value != undefined ? commonService.firstSet.value : [];
  let secondGroup = commonService.secondSet.value != undefined ? commonService.secondSet.value : [];
  let newGroup = [...firstGroup, ...secondGroup];
  let ids = newGroup.map((obj) => obj.ID);
  ajaxService.computePCA(ids).done(function (jsonData) {
    createScatterPlot(jsonData, true);
  });
}

function putAllEmpty(svg) {
  svg.selectAll(".brush").remove(); // Rimuovi eventuali rettangoli di selezione precedenti
  svg.selectAll(".selectedScatterPlot").classed("selectedScatterPlot", false);
  svg.selectAll(".selectedScatterPlotParallels").classed("selectedScatterPlotParallels", false);
  svg.selectAll(".group1").classed("group1", false);
  svg.selectAll(".group2").classed("group2", false);
  numberOfBrush = 0;
  commonService.setFirstSet([]);
  commonService.setSecondSet([]);
  firstSet = [];
  secondSet = [];
  firstBrush = [];
  secondBrush = [];
  commonService.resetCheckBox();
  categoryService.resetCategory();
}

function removeBrush(svg) {
  svg.selectAll(".brush").remove();
  d3.select(".brushRect").remove();
  numberOfBrush = 0;
  commonService.resetCheckBox();
  categoryService.resetCategory();
}
export function setAxisToInitialValue() {
  // if (initilizedX != undefined && initilizedY != undefined) {x
  x = newX;
  y = newY;

  // }
}
// Function that is triggered when brushing is performed
export function updateChart(force) {
  var mode = commonService.mode.value;
  var svg = d3.select("#scatterPlot").select("svg").select("g");
  if (mode == "Visualize") {
    if (d3.event != null && d3.event.selection != null) {
      var extent = d3.event.selection;
      // Se il brushing è vuoto, reimposta la classe e interrompi la funzione
      if (extent[0][0] == extent[1][0] && extent[0][1] == extent[1][1]) {
        svg.selectAll(".selectedScatterPlot").classed("selectedScatterPlot", true)
        if (numberOfBrush == 1 || numberOfBrush > 1) {
          svg.selectAll(".brush").remove(); // Rimuovi eventuali rettangoli di selezione precedenti
          svg.selectAll("circle").classed("selectedScatterPlot", true);
          numberOfBrush = 0;
          commonService.setFirstSet(allData);
          firstSet = allData;
          firstBrush = [];
          commonService.resetCheckBox();
          categoryService.resetCategory();
        }
        return;
      }
      // Imposta la classe "selected" per i cerchi all'interno della selezione del brushing
      let selectedSet = [];
      svg.selectAll("circle").classed("selectedScatterPlot", function (d) {
        var cx = x(d.Y1);
        var cy = y(d.Y2);
        if (cx >= extent[0][0] && cx <= extent[1][0] && cy >= extent[0][1] && cy <= extent[1][1]) {
          //d is in the brush
          selectedSet.push(d);
          return true;
        } else if (isInsideSet(d)) return true;
        else return false;
      });
      // Primo brush che faccio e non ho categorie selezionate
      if (numberOfBrush == 0 && categoryService.selectedCategories.length == 0) {
        commonService.setFirstSet(selectedSet);
        firstSet = selectedSet;
      }
      // Primo brush che faccio e ho categoria selezionata
      else if (numberOfBrush == 0 && categoryService.selectedCategories.length > 0) {
        var oldSet = commonService.firstSet.value;
        if (oldSet == undefined || oldSet.length == 0) {
          var mergedArray = selectedSet;
        } else {
          var unicAddingSet = selectedSet.filter((obj2) => !oldSet.some((obj1) => obj1.ID === obj2.ID));
          var mergedArray = [...oldSet, ...unicAddingSet];
        }
        commonService.setFirstSet(mergedArray);
        // commonService.setFirstSet(newSet);
        // firstSet = newSet;
      }
    }
  } else {
    if (d3.event != null && d3.event.selection != null) {
      var extent = d3.event.selection;
      // Se il brushing è vuoto, reimposta la classe e interrompi la funzione
      if (extent[0][0] == extent[1][0] && extent[0][1] == extent[1][1]) {
        svg.selectAll(".selectedScatterPlot").classed("selectedScatterPlot", true).classed("selectedScatterPlotFilteredParallel", false).classed("selectedScatterPlotParallel", false);
        if(commonService.firstSet.value.length != 0 && commonService.secondSet.value.length != 0 ) {
          putAllEmpty(svg);
        }
        return;
      }
      // Imposta la classe "selected" per i cerchi all'interno della selezione del brushing
      let selectedSet = [];
      svg.selectAll("circle").classed("selectedScatterPlot", function (d) {
        var cx = x(d.Y1);
        var cy = y(d.Y2);
        if (cx >= extent[0][0] && cx <= extent[1][0] && cy >= extent[0][1] && cy <= extent[1][1]) {
          selectedSet.push(d);
          return true;
        } else if (isInsideSet(d)) return true;
        else {
          return false;
        }
      });
      // Primo brush che faccio e non ho categorie selezionate
      if (numberOfBrush == 0 && categoryService.numberOfCheckBoxSelected == 0) {
        commonService.setFirstSet(selectedSet);
        selectedSet.forEach((circle) => {
          svg.select("circle[id='" + circle.ID + "']").classed("group1", true)
        });
        firstSet = selectedSet;
      }
      // Primo brush che faccio e ho categoria selezionata
      else if (numberOfBrush == 0 && categoryService.numberOfCheckBoxSelected == 1) {
        commonService.setSecondSet(selectedSet);
        selectedSet.forEach((circle) => {
          svg.select("circle[id='" + circle.ID + "']").classed("group2", true)
        });
        secondSet = selectedSet;
        commonService.disabledCheckBox();
      }
      // Secondo brush che faccio e non ho categorie selezionate
      else if (numberOfBrush == 1 && categoryService.numberOfCheckBoxSelected == 0) {
        if (firstBrush.length == 0) {
          commonService.setFirstSet(selectedSet);
          selectedSet.forEach((circle) => {
            svg.select("circle[id='" + circle.ID + "']").classed("group1", true)
          });
          firstSet = selectedSet;
        } else if (secondBrush.length == 0) {
          commonService.setSecondSet(selectedSet);
          selectedSet.forEach((circle) => {
            svg.select("circle[id='" + circle.ID + "']").classed("group2", true)
          });
          secondSet = selectedSet;
        }
        commonService.disabledCheckBox();
      }

      if (numberOfBrush > 1 || (numberOfBrush == 1 && categoryService.numberOfCheckBoxSelected == 1)) {
        putAllEmpty(svg);
      }
    }
  }
  if (force) svg.selectAll("circle").classed("selectedScatterPlot", true);
}

function isInsideSet(d) {
  let res = false;
  if (commonService.firstSet.value != undefined) {
    res = res || commonService.firstSet.value.includes(d);
  } else if (commonService.secondSet.value != undefined) {
    res = res || commonService.secondSet.value.includes(d);
  }
  return res;
}

function getBorderGroupClass(d) {
  if (globalRecalculated) {
    let group1 = commonService.firstSet.value.map((obj) => obj.ID);
    if (group1.includes(d.ID)) {
      var color = "group1";
    } else {
      var color = "group2";
    }
    return color;
  } else {
    return "";
  }
}