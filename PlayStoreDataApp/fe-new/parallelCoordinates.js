import "./interface.js";
import * as categoryService from "./category.js";
import * as commonService from "./commonService.js";
let countClick = 0;
let scaleColor;
let allData;
var firstGroup;
var secondGroup;
export var selected = [];

export function createParallelCoordinates(jsonPCAData) {
  allData = jsonPCAData;
  scaleColor = commonService.getScaleColor();
  // jsonPCAData = jsonPCAData.slice(0, 5);
  // console.log(commonService.distinctValuesPerKey(jsonPCAData))

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 10, bottom: 10, left: 10 },
    width = 768 - margin.left - margin.right,
    height = 330 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#parallelCoordinates")
    .select("svg")
    .select("g.parallelG");
  if (svg.empty()) {
    svg = d3
      .select("#parallelCoordinates")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "parallelG")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  let dimensions = [
    "Rating",
    "Reviews",
    "Size",
    "Installs",
    "Price",
    "Content_Rating",
    "Type",
  ];
  let dimensionsString = ["Content_Rating", "Type"];
  const distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData);
  // For each dimension, build a linear scale and store it in the y object
  var y = {};
  dimensions.forEach((dim) => {
    if (dimensionsString.includes(dim)) {
      y[dim] = d3
        .scalePoint()
        .domain(distinctPCAData[dim])
        .range([0, height])
        .padding(0.5);
    } else {
      y[dim] = d3
        .scaleLinear()
        .domain([
          d3.min(jsonPCAData, function (d) {
            return +d[dim];
          }),
          d3.max(jsonPCAData, function (d) {
            return +d[dim];
          }),
        ])
        .range([height, 0]);
    }
  });

  // Build the X scale -> it finds the best position for each Y axis
  var x = d3.scalePoint().range([0, width]).padding(0.1).domain(dimensions);

  // The path function takes a row of the data as input and returns x and y coordinates of the line to draw for this row.
  function path(d) {
    return d3.line()(
      dimensions.map(function (p) {
        if (dimensionsString.includes(p)) return [x(p), y[p](d[p])];
        else return [x(p), y[p](+d[p])];
      })
    );
  }

  function getColorPath(d) {
    return scaleColor(d.Category);
  }
  // Draw the lines
  svg.selectAll(".myPath").remove();
  let myPath = svg
    .selectAll(".myPath")
    .data(jsonPCAData.sort((a, b) => d3.ascending(a.Category, b.Category)))
    .enter()
    .append("path")
    .attr("class", "myPath")
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", getColorPath)
    .style("stroke-width", "2px")
    .style("opacity", 0.5);

  svg.selectAll(".myAxis").remove();
  let axes = svg
    .selectAll(".myAxis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "myAxis")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    })
    .each(function (d) {
      const axis = d3.axisLeft().scale(y[d]);

      d3.select(this).call(axis);

      // Add vertical brush
      const brush = d3
        .brushY()
        .extent([
          [-10, 0],
          [10, height + 1],
        ])
        .on("start brush", brushedVertical);

      d3.select(this).call(brush);
    })
    .append("text")
    .style("text-anchor", "middle")
    .style("z-index", 99)
    .attr("y", -9)
    .text(function (d) {
      return d;
    })
    .style("fill", "white");

  let selections = new Map();
  let selectionsString = new Map();
  let brushSelectionActive = new Map();
  const selectedColor = "yellow"; // Change the color for selected paths

  function brushedVertical(event) {
    selected = [];
    if (!d3.event.selection) {
      selections.delete(event);
      selectionsString.delete(event);
      brushSelectionActive.delete(event);
    } else {
      if (
        d3.event.selection != null &&
        !(d3.event.selection[0] == d3.event.selection[1])
      ) {
        const invertedSelection = d3.event.selection.map((value, i) => {
          return y[event].invert ? y[event].invert(value) : y[event](value);
        });
        if (dimensionsString.includes(event))
          brushSelectionActive.set(event, d3.event.selection);
        selections.set(event, invertedSelection);
      } else {
        selections.delete(event);
        selectionsString.delete(event);
        brushSelectionActive.delete(event);
      }
    }

    svg.selectAll(".myPath").each(function (d) {
      let isActive = Array.from(selections).every(([brushKey, [max, min]]) => {
        if (dimensionsString.includes(brushKey)) {
          //todo prendere lista pointInBrush, calcolare brushMin, brushMax e poi effettuare controllo
          let valueInBrush = isBrushInsidePointScale(brushKey).map((x) =>
            y[brushKey](x)
          );

          const yCoordinate = y[brushKey](d[brushKey]);

          return valueInBrush.includes(yCoordinate);
        } else {
          const valueKeySelected = d[brushKey];
          return valueKeySelected >= min && valueKeySelected <= max;
        }
      });

      if (selections.size == 0) isActive = false;
      d3.select(this).style(
        "stroke",
        isActive ? selectedColor : scaleColor(d.Category)
      );

      if (isActive) {
        selected.push(d);
      } else {
        let index = selected.indexOf(d);
        if (index != -1) selected.splice(index, 1);
      }
    });
    addBorderToCircleSelected(selected);
  }
  function isBrushInsidePointScale(brushKey) {
    const domainValues = y[brushKey].domain();
    let ris = [];
    let selection = brushSelectionActive.get(brushKey);
    for (const value of domainValues) {
      const position = y[brushKey](value);
      if (selection[0] <= position && position <= selection[1]) {
        ris.push(value);
      }
    }

    return ris; // The brush selection doesn't contain any point
  }
  // function invertPointScale(value, dimension) {
  //   const rangeValues = y[dimension].range();
  //   const domainValues = y[dimension].domain();
  //   const bisect = d3.bisectLeft(rangeValues, value);

  //   if (bisect === 0 || bisect === rangeValues.length) {
  //     return domainValues[bisect];
  //   }

  //   const leftValue = rangeValues[bisect - 1];
  //   const rightValue = rangeValues[bisect];

  //   // Determine if the value is inside the range
  //   if (value >= leftValue && value <= rightValue) {
  //     return domainValues[bisect - 1];
  //   }

  //   // If the value is outside the range, return the closest domain value
  //   return value - leftValue > rightValue - value ? domainValues[bisect] : domainValues[bisect - 1];
  //   }
}

export function createParallelCoordinatesCompare() {
  var jsonPCAData = allData;

  scaleColor = commonService.getScaleColor();
  var divWidth = d3.select("#parallelCoordinates").node().clientWidth;
  var divHeigth = d3.select("#parallelCoordinates").node().clientHeight;
  var margin = { top: 30, right: 10, bottom: 10, left: 30 },
    width = divWidth - margin.left - margin.right,
    height = divHeigth - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#parallelCoordinates")
    .select("svg")
    .select("g.parallelG");
  if (svg.empty()) {
    svg = d3
      .select("#parallelCoordinates")
      .append("svg")
      .attr("width", divWidth - 1)
      .attr("height", divHeigth - 1)
      .append("g")
      .attr("class", "parallelG")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  let dimensions = [
    "Rating",
    "Reviews",
    "Size",
    "Installs",
    "Price",
    "Content_Rating",
    "Type",
  ];
  let dimensionsString = ["Content_Rating", "Type"];
  let distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData);
  // For each dimension, build a linear scale and store it in the y object
  var y = {};
  dimensions.forEach((dim) => {
    if (dimensionsString.includes(dim)) {
      y[dim] = d3
        .scalePoint()
        .domain(distinctPCAData[dim])
        .range([0, height])
        .padding(0.5);
    } else {
      y[dim] = d3
        .scaleLinear()
        .domain([
          d3.min(jsonPCAData, function (d) {
            return +d[dim];
          }),
          d3.max(jsonPCAData, function (d) {
            return +d[dim];
          }),
        ])
        .range([height, 0]);
    }
  });

  // Build the X scale -> it finds the best position for each Y axis
  var x = d3.scalePoint().range([0, width]).padding(0.1).domain(dimensions);

  // Draw the lines
  svg.selectAll(".myPath").remove();
  commonService.firstSet.observe((data) => {
    if (commonService.mode.value == "Compare") {
      firstGroup =
        commonService.firstSet != undefined ? commonService.firstSet.value : [];
      secondGroup =
        commonService.secondSet.value != undefined
          ? commonService.secondSet.value
          : [];

      jsonPCAData = [...firstGroup, ...secondGroup];
      distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData);
      if (jsonPCAData.length != 0) {
        y = {};
        dimensions.forEach((dim) => {
          if (dimensionsString.includes(dim)) {
            y[dim] = d3
              .scalePoint()
              .domain(distinctPCAData[dim])
              .range([0, height])
              .padding(0.5);
          } else {
            y[dim] = d3
              .scaleLinear()
              .domain([
                d3.min(jsonPCAData, function (d) {
                  return +d[dim];
                }),
                d3.max(jsonPCAData, function (d) {
                  return +d[dim];
                }),
              ])
              .range([height, 0]);
          }
        });
      }

      // The path function takes a row of the data as input and returns x and y coordinates of the line to draw for this row.
      function path(d) {
        return d3.line()(
          dimensions.map(function (p) {
            if (dimensionsString.includes(p)) return [x(p), y[p](d[p])];
            else return [x(p), y[p](+d[p])];
          })
        );
      }

      function getColorPath(d) {
        if (firstGroup.includes(d)) {
          if (categoryService.firstCategory != null) {
            return scaleColor(d.Category);
          } else {
            return "rgb(255,0,0)";
          }
        } else {
          if (categoryService.secondCategory != null) {
            return scaleColor(d.Category);
          } else {
            return "rgb(0,0,255)";
          }
        }
      }
      svg.selectAll(".myPath2").remove();
      svg.selectAll(".myPath1").remove();
      if (jsonPCAData.length != 0) {
        svg
          .selectAll(".myPath1")
          .data(
            jsonPCAData.sort((a, b) => d3.ascending(a.Category, b.Category))
          )
          .enter()
          .append("path")
          .attr("class", "myPath1")
          .attr("d", path)
          .style("fill", "none")
          .style("stroke", getColorPath)
          .style("stroke-width", "2px")
          .style("opacity", 0.5);
      }

      svg.selectAll(".myAxis").remove();
      let axes = svg
        .selectAll(".myAxis")
        .data(dimensions)
        .enter()
        .append("g")
        .attr("class", "myAxis")
        .attr("transform", function (d) {
          return "translate(" + x(d) + ")";
        })
        .each(function (d) {
          const axis = d3.axisLeft().scale(y[d]);

          d3.select(this).call(axis);

          // Add vertical brush
          const brush = d3
            .brushY()
            .extent([
              [-10, 0],
              [10, height + 1],
            ])
            .on("start brush", brushedVerticalCompare);

          d3.select(this).call(brush);
        })
        .append("text")
        .style("text-anchor", "middle")
        // .style("z-index", 99)
        .attr("y", -9)
        .text(function (d) {
          return d;
        })
        .style("fill", "white");
    }
  });
  commonService.secondSet.observe((data) => {
    if (commonService.mode.value == "Compare") {
      firstGroup =
        commonService.firstSet != undefined ? commonService.firstSet.value : [];
      secondGroup =
        commonService.secondSet.value != undefined
          ? commonService.secondSet.value
          : [];

      jsonPCAData = [...firstGroup, ...secondGroup];
      distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData);
      if (jsonPCAData.length != 0) {
        y = {};
        dimensions.forEach((dim) => {
          if (dimensionsString.includes(dim)) {
            y[dim] = d3
              .scalePoint()
              .domain(distinctPCAData[dim])
              .range([0, height])
              .padding(0.5);
          } else {
            y[dim] = d3
              .scaleLinear()
              .domain([
                d3.min(jsonPCAData, function (d) {
                  return +d[dim];
                }),
                d3.max(jsonPCAData, function (d) {
                  return +d[dim];
                }),
              ])
              .range([height, 0]);
          }
        });
      }

      // The path function takes a row of the data as input and returns x and y coordinates of the line to draw for this row.
      function path(d) {
        return d3.line()(
          dimensions.map(function (p) {
            if (dimensionsString.includes(p)) return [x(p), y[p](d[p])];
            else return [x(p), y[p](+d[p])];
          })
        );
      }

      svg.selectAll(".myPath1").remove();
      svg.selectAll(".myPath2").remove();
      if (jsonPCAData.length != 0) {
        svg
          .selectAll(".myPath2")
          .data(
            jsonPCAData.sort((a, b) => d3.ascending(a.Category, b.Category))
          )
          .enter()
          .append("path")
          .attr("class", "myPath2")
          .attr("d", path)
          .style("fill", "none")
          .style("stroke", getColorPath)
          .style("stroke-width", "2px")
          .style("opacity", 0.5);
      }
      svg.selectAll(".myAxis").remove();
      let axes = svg
        .selectAll(".myAxis")
        .data(dimensions)
        .enter()
        .append("g")
        .attr("class", "myAxis")
        .attr("transform", function (d) {
          return "translate(" + x(d) + ")";
        })
        .each(function (d) {
          const axis = d3.axisLeft().scale(y[d]);
          d3.select(this).call(axis);
          // Add vertical brush
          const brush = d3
            .brushY()
            .extent([
              [-10, 0],
              [10, height + 1],
            ])
            .on("start brush", brushedVerticalCompare);
          d3.select(this).call(brush);
        })
        .append("text")
        .style("text-anchor", "middle")
        // .style("z-index", 99)
        .attr("y", -9)
        .text(function (d) {
          return d;
        })
        .style("fill", "white");
    }
  });

  svg.selectAll(".myAxis").remove();
  let axes = svg
    .selectAll(".myAxis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "myAxis")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    })
    .each(function (d) {
      const axis = d3.axisLeft().scale(y[d]);

      d3.select(this).call(axis);

      // Add vertical brush
      const brush = d3
        .brushY()
        .extent([
          [-10, 0],
          [10, height + 1],
        ])
        .on("start brush", brushedVerticalCompare);

      d3.select(this).call(brush);
    })
    .append("text")
    .style("text-anchor", "middle")
    // .style("z-index", 99)
    .attr("y", -9)
    .text(function (d) {
      return d;
    })
    .style("fill", "white");

  let selections = new Map();
  let selectionsString = new Map();
  let brushSelectionActive = new Map();
  const selectedColor = "yellow"; // Change the color for selected paths

  function brushedVerticalCompare(event) {
    selected = [];
    if (!d3.event.selection) {
      selections.delete(event);
      selectionsString.delete(event);
      brushSelectionActive.delete(event);
    } else {
      if (
        d3.event.selection != null &&
        !(d3.event.selection[0] == d3.event.selection[1])
      ) {
        const invertedSelection = d3.event.selection.map((value, i) => {
          return y[event].invert ? y[event].invert(value) : y[event](value);
        });
        if (dimensionsString.includes(event))
          brushSelectionActive.set(event, d3.event.selection);
        selections.set(event, invertedSelection);
      } else {
        selections.delete(event);
        selectionsString.delete(event);
        brushSelectionActive.delete(event);
      }
    }

    svg.selectAll(".myPath1, .myPath2").each(function (d) {
      let isActive = Array.from(selections).every(([brushKey, [max, min]]) => {
        if (dimensionsString.includes(brushKey)) {
          //todo prendere lista pointInBrush, calcolare brushMin, brushMax e poi effettuare controllo
          let valueInBrush = isBrushInsidePointScale(brushKey).map((x) =>
            y[brushKey](x)
          );

          const yCoordinate = y[brushKey](d[brushKey]);

          return valueInBrush.includes(yCoordinate);
        } else {
          const valueKeySelected = d[brushKey];
          return valueKeySelected >= min && valueKeySelected <= max;
        }
      });

      if (selections.size == 0) isActive = false;
      d3.select(this).style(
        "stroke",
        isActive ? selectedColor : getColorPath(d)
      );

      if (isActive) {
        selected.push(d);
      } else {
        let index = selected.indexOf(d);
        if (index != -1) selected.splice(index, 1);
      }
    });
    addBorderToCircleSelected(selected);
  }
  function isBrushInsidePointScale(brushKey) {
    const domainValues = y[brushKey].domain();
    let ris = [];
    let selection = brushSelectionActive.get(brushKey);
    for (const value of domainValues) {
      const position = y[brushKey](value);
      if (selection[0] <= position && position <= selection[1]) {
        ris.push(value);
      }
    }

    return ris; // The brush selection doesn't contain any point
  }
  function getColorPath(d) {
    if (firstGroup.includes(d)) {
      if (categoryService.firstCategory != null) {
        return scaleColor(d.Category);
      } else {
        return "rgb(255,0,0)";
      }
    } else {
      if (categoryService.secondCategory != null) {
        return scaleColor(d.Category);
      } else {
        return "rgb(0,0,255)";
      }
    }
  }
}

function addBorderToCircleSelected(selectedList) {
  d3.select("#scatterPlot")
    .selectAll("circle")
    .each(function (d) {
      if (selectedList.includes(d))
        d3.select(this)
          .classed("selectedScatterPlot", false)
          .classed("selectedScatterPlotFilteredParallel", true);
      else
        d3.select(this)
          .classed("selectedScatterPlot", true)
          .classed("selectedScatterPlotFilteredParallel", false);
    });
}
