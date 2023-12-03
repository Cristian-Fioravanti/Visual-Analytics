import "./interface.js";
import * as categoryService from "./category.js";
import * as commonService from "./commonService.js";
let countClick = 0;
let scaleColor;

function createParallelCoordinates(jsonPCAData) {
  scaleColor = commonService.getScaleColor();
  // jsonPCAData = jsonPCAData.slice(0, 5);

  // console.log(commonService.distinctValuesPerKey(jsonPCAData))

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 10, bottom: 10, left: 30 },
    width = 768 - margin.left - margin.right,
    height = 330 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#parallelCoordinates")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let dimensions = ["Rating", "Reviews", "Size", "Installs", "Price", "Content_Rating", "Type"];
  let dimensionsString = ["Content_Rating", "Type"];
  const distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData);
  // For each dimension, build a linear scale and store it in the y object
  var y = {};
  dimensions.forEach((dim) => {
    if (dimensionsString.includes(dim)) {
      y[dim] = d3.scalePoint().domain(distinctPCAData[dim]).range([0, height]).padding(0.5);
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
  var x = d3.scalePoint().range([0, width]).padding(1).domain(dimensions);

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
          [10, height+1],
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
  let brushSelectionActive= new Map()
  const selectedColor = "blue"; // Change the color for selected paths

  function brushedVertical(event) {
    if (!d3.event.selection) {
      selections.delete(event);
      selectionsString.delete(event);
       brushSelectionActive.delete(event)
    } else {
      if (d3.event.selection != null && !(d3.event.selection[0] == d3.event.selection[1])) {
        const invertedSelection = d3.event.selection.map((value, i) => {
          return y[event].invert ? y[event].invert(value) :  y[event](value);
        });
        if (dimensionsString.includes(event)) brushSelectionActive.set(event,d3.event.selection)
        selections.set(event, invertedSelection);
      } else {
        selections.delete(event);
        selectionsString.delete(event);
        brushSelectionActive.delete(event)
      }
    }

    const selected = [];
    svg.selectAll(".myPath").each(function (d) {
      let isActive = Array.from(selections).every(([brushKey, [min, max]]) => {
        if (dimensionsString.includes(brushKey)) {
          //todo prendere lista pointInBrush, calcolare brushMin, brushMax e poi effettuare controllo
          let valueInBrush = isBrushInsidePointScale(brushKey).map(x=> y[brushKey](x))
        
          const yCoordinate = y[brushKey](d[brushKey]);
          
          return valueInBrush.includes(yCoordinate);
        } else {
          const valueKeySelected = d[brushKey];
          return valueKeySelected >= min && valueKeySelected <= max;
        }
      });

      if (selections.size == 0) isActive = false;
      d3.select(this).style("stroke", isActive ? selectedColor : scaleColor(d.Category));

      if (isActive) {
        selected.push(d);
      }
    });
  }
function isBrushInsidePointScale(brushKey) {
  const domainValues = y[brushKey].domain();
  let ris = []
  let selection = brushSelectionActive.get(brushKey)
  for (const value of domainValues) {
    const position = y[brushKey](value);
    if (selection[0] <= position && position <= selection[1]) { 
      ris.push(value)
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

export { createParallelCoordinates };
