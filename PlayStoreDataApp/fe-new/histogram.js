import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";

let allDataInstalls;

export function createHistogramInstalls(dataSet) {
  allDataInstalls = dataSet;
  // set the dimensions and margins of the graph
  let divWidth = d3.select(".Histogram3").node().clientWidth;
  let divHeigth = d3.select(".Histogram3").node().clientHeight;
  var margin = { top: 20, right: 15, bottom: 30, left: 40 },
    width = divWidth - margin.left - margin.right,
    height = divHeigth - margin.top - margin.bottom;
  var y;
  var x;
  let tooltip = d3.select("#Histogram3").select("span.tooltip")
  if(tooltip.empty()){
    tooltip = d3.select("#Histogram3")
      .append("span")
      .attr("class","tooltip")
      .style("opacity", 0)
      .style("background-color", "black")
      .style("position", "absolute")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
  }

  let mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  let mousemove = function (d) {
    let containerY = d3.event.clientY - d3.select("#Histogram3").node().getBoundingClientRect().top- margin.top;
    
    // Calcola le coordinate y relative al grafico
    let mouseY = y.invert(containerY);
    
    // Aggiungi il testo desiderato nel tooltip
    tooltip.html(d.length)
        
      .style("left", x(d.x0)-24 + "px")
       // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", y(mouseY) -30+ "px")
      .style("transform", "translate(" + x(d.x0) + "," + y(d.length) + ")")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  let mouseleave = function(d) {
    tooltip.style("opacity", 0)
    
  }  
  // append the svg object to the body of the page
  let svg = d3.select("#Histogram3").select("svg").select("g.ShortInstalls");
  if (svg.empty()) {
    svg = d3
      .select("#Histogram3")
      .append("svg")
      .attr("width", divWidth - 1)
      .attr("height", divHeigth - 1)
      .append("g")
      .classed("ShortInstalls", true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  // get the data

  // X axis: scale and draw:
  const xTickFormat = function (d) {
    return "10^" + Math.round(Math.log10(d));
  };
  x = d3
    .scaleLog()
    .domain([1, 100000000000]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width]);
  let histogramSvg = svg.select("g.x.axis");
  if (histogramSvg.empty()) {
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(d3.axisBottom(x).tickFormat(xTickFormat));
  }

  // set the parameters for the histogram
  const histogram = d3
    .histogram()
    .value(function (d) {
      return d.Installs;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(10)); // then the numbers of bins

  // And apply this function to data to get the bins
  let bins = histogram(dataSet);

  // Y axis: scale and draw:

  y = d3.scaleLinear().range([height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); // d3.hist has to be called before the Y axis obviously
  let axisY = svg.select("g.installsY");
  if (axisY.empty) {
    svg.append("g").attr("class", "installsY").call(d3.axisLeft(y));
  } else {
    axisY.call(d3.axisLeft(y));
  }

  function popolaTabella(data) {
    d3.select(".ShortInstalls").selectAll("rect").remove();
    d3.select(".ShortInstalls")
      .selectAll("rect")
      .data(data)
      .join(
        function (enter) {
          enterData(enter);
        },
        function (update) {
          updateData(update);
        }
      );
  }

  function enterData(enter) {
    enter
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0);
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#cb2322").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }

  function updateData(update) {
    update
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0);
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#cb2322").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }

  // Aggiungi un titolo sopra l'istogramma
  const titleFontSize = 15;
  if(svg.select("text.Installs").empty()) {
    svg
      .append("text")
      .attr("x", x(100)) // Posizione x al centro del grafico
      .attr("y", -5) // Posizione y sopra il boxplot, regolabile in base alle tue esigenze
      .attr("text-anchor", "middle") // Allinea il testo al centro
      .style("font-size", titleFontSize + "px")
      .attr("class","Installs")
      .text("Installs of selected data"); 
  } 

  popolaTabella([]);
  popolaTabella(histogram(dataSet.map((obj) => ({ Installs: parseInt(obj.Installs) }))));
  commonService.firstSet.observe((data) => {
    if (commonService.mode.value == "Visualize") {
      // And apply this function to data to get the bins
      let dataSet = commonService.firstSet != undefined ? commonService.firstSet.value : allDataInstalls;
      const dataY = dataSet.length != 0 ? dataSet : allDataInstalls;
      bins = histogram(dataY);
      // Y axis: scale and draw:
      y = d3.scaleLinear().range([height, 0]);
      y.domain([
        0,
        d3.max(bins, function (d) {
          return d.length;
        }),
      ]); // d3.hist has to be called before the Y axis obviously
      svg.select("g.installsY").remove();
      svg.append("g").attr("class", "installsY").call(d3.axisLeft(y));
      popolaTabella([]);
      if (dataSet.length != 0) {
        popolaTabella(
          histogram(
            commonService.firstSet.value.map((obj) => ({
              Installs: parseInt(obj.Installs),
            }))
          )
        );
      }
    }
  });
}

export function createHistogramType(dataDistinct, data) {
  let dataSet = data != undefined ? data : [];
  const domainY = dataSet.length != 0 ? dataSet.length : 7023;
  var y;
  var x;
  let tooltip = d3.select("#Histogram1").select("span.tooltip")
  if(tooltip.empty()){
    tooltip = d3.select("#Histogram1")
    .append("span")
    .attr("class","tooltip")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("position", "absolute")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
  }

  let mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  let mousemove = function(d) {
    tooltip
      .html(d.Total)
      .style("left", (d3.event.clientX+10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.event.clientY-50) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  let mouseleave = function(d) {
    tooltip.style("opacity", 0)
    
  }  

  function popolaTabella(data) {
    d3.select(".ShortTicks").selectAll("rect").remove();
    d3.select(".ShortTicks")
      .selectAll("rect")
      .data(data)
      .join(
        function (enter) {
          enterData(enter);
        },
        function (update) {
          updateData(update);
        }
      );
  }

  function enterData(enter) {
    enter
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + (x(d.Type) - 5) + "," + y(d.Total) + ")";
      })
      .attr("width", function (d) {
        return 10;
      })
      .attr("height", function (d) {
        return height - y(d.Total);
      })
      .style("fill", "#cb2322").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }

  function updateData(update) {
    update
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0);
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#cb2322").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }

  // set the dimensions and margins of the graph
  const divWidth = d3.select(".Histogram1").node().clientWidth;
  const divHeigth = d3.select(".Histogram1").node().clientHeight;
  var margin = { top: 20, right: 5, bottom: 30, left: 40 },
    width = divWidth - margin.left - margin.right,
    height = divHeigth - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3.select("#Histogram1").select("svg").select("g.ShortTicks");
  if (svg.empty()) {
    svg = d3
      .select("#Histogram1")
      .append("svg")
      .attr("width", divWidth - 1)
      .attr("height", divHeigth - 1)
      .append("g")
      .classed("ShortTicks", true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  
  // X axis: scale and draw:
  const domainX = dataDistinct.length != 0 ? dataDistinct : ["Free", "Paid"];
  x = d3
    .scalePoint()
    .domain(domainX) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width])
    .padding(1);
  const xAxis = svg.select("g.x.axis");
  if (xAxis.empty()) {
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  } else {
    xAxis.attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
  }
  // Y axis: scale and draw:
  y = d3.scaleSymlog().range([height, 0]).domain([0, domainY]);
  
  function generateCustomTicks(y) {
    let tickValues = [y.domain()[0]];
    let currentValue = y.domain()[1];

    while (currentValue > 10) {
      currentValue /= 2;
      tickValues.push(currentValue);
    }
    tickValues.push(y.domain()[1]);
    return tickValues;
  }

  let yAxis = svg.select("g.HistogramSvg1");
  if (yAxis.empty()) {
    svg
      .append("g")
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
      .attr("class", "HistogramSvg1");
  } else {
    yAxis.call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0)).attr("class", "HistogramSvg1");
  }

  // Aggiungi un titolo sopra l'istogramma
  const titleFontSize = 15;
  if(svg.select("text.Type").empty()) {
    svg
      .append("text")
      .attr("x", x("Free")) // Posizione x al centro del grafico
      .attr("y", -5) // Posizione y sopra il boxplot, regolabile in base alle tue esigenze
      .attr("text-anchor", "middle") // Allinea il testo al centro
      .style("font-size", titleFontSize + "px")
      .attr("class","Type")
      .text("Type of selected data"); 
  } 

  popolaTabella([]);
  const dataType = Array.from(new Set(dataSet.map((obj) => obj.Type))).map((Type) => ({ Type, Total: dataSet.filter((x) => x.Type === Type).length }));
  popolaTabella(dataType);
}

export function createHistogramContentRating(dataDistinct, data) {
  let dataSet = data != undefined ? data : [];
  // set the dimensions and margins of the graph
  var y;
  const divWidth = d3.select(".Histogram2").node().clientWidth;
  const divHeigth = d3.select(".Histogram2").node().clientHeight;
  const margin = { top: 20, right: 5, bottom: 30, left: 40 },
    width = 350 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;

  let tooltip = d3.select("#Histogram2").select("span.tooltip")
  if(tooltip.empty()){
    tooltip = d3.select("#Histogram2")
      .append("span")
      .attr("class","tooltip")
      .style("opacity", 0)
      .style("background-color", "black")
      .style("position", "absolute")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
  }
    
  let mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  let mousemove = function(d) {
    tooltip
      .html(d.Total)
      .style("left", (d3.event.clientX+10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.event.clientY-50) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  let mouseleave = function(d) {
    tooltip.style("opacity", 0)
    
  }  
  let svg = d3.select("#Histogram2").select("svg").select("g.ContentRating");
  if (svg.empty()) {
    // append the svg object to the body of the page
    svg = d3
      .select("#Histogram2")
      .append("svg")
      .attr("width", divWidth - 1)
      .attr("height", divHeigth - 1)
      .append("g")
      .classed("ContentRating", true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  const domainX = dataDistinct.length != 0 ? dataDistinct : ["Everyone", "Teen", "Adults Only"];
  // X axis: scale and draw:
  let x = d3
    .scalePoint()
    .domain(domainX) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width])
    .padding(1);
  let xAxis = svg.select("g.x.axis");
  if (xAxis.empty()) {
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  } else {
    xAxis.attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
  }

  // Y axis: scale and draw:
  const domainY = dataSet.length != 0 ? dataSet.length : 7023;
  y = d3.scaleSymlog().range([height, 0]).domain([0, domainY]);

  function generateCustomTicks(y) {
    let tickValues = [y.domain()[0]];
    let currentValue = y.domain()[1];

    while (currentValue > 10) {
      currentValue /= 2;
      tickValues.push(currentValue);
    }

    tickValues.push(y.domain()[1]);

    return tickValues;
  }

  let yAxis = svg.select("g.HistogramSvg2");
  if (yAxis.empty()) {
    svg
      .append("g")
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
      .attr("class", "HistogramSvg2");
  } else {
    yAxis.call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0)).attr("class", "HistogramSvg2");
  }

  function popolaTabella(data) {
    d3.select(".ContentRating").selectAll("rect").remove();
    d3.select(".ContentRating")
      .selectAll("rect")
      .data(data)
      .join(
        function (enter) {
          enterData(enter);
        },
        function (update) {
          updateData(update);
        }
      );
  }

  function enterData(enter) {
    enter
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        const transX = x(d.Content_Rating) - 5;
        return "translate(" + transX + "," + y(d.Total) + ")";
      })
      .attr("width", function (d) {
        return 10;
      })
      .attr("height", function (d) {
        return height - y(d.Total);
      })
      .style("fill", "#cb2322").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }

  function updateData(update) {
    update
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        const transX = parseInt(x(d.Content_Rating)) - 5;
        return "translate(" + transX + "," + y(d.Total) + ")";
      })
      .attr("width", function (d) {
        return 10;
      })
      .attr("height", function (d) {
        return height - y(d.Total);
      })
      .style("fill", "#cb2322").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }
  
  // Aggiungi un titolo sopra l'istogramma
  const titleFontSize = 15;
  if(svg.select("text.Ratings").empty()) {
    svg
      .append("text")
      .attr("x", (x("Everyone")+5)) // Posizione x al centro del grafico
      .attr("y", -5) // Posizione y sopra il boxplot, regolabile in base alle tue esigenze
      .attr("text-anchor", "middle") // Allinea il testo al centro
      .style("font-size", titleFontSize + "px")
      .attr("class","Ratings")
      .text("Ratings of selected data"); 
  } 

  popolaTabella([]);
  const dataContent_Rating = Array.from(new Set(dataSet.map((obj) => obj.Content_Rating))).map((Content_Rating) => ({
    Content_Rating,
    Total: dataSet.filter((x) => x.Content_Rating === Content_Rating).length,
  }));
  popolaTabella(dataContent_Rating);
}

export function populateHistograms(jsonData) {
  initializeHistograms(jsonData);
  commonService.firstSet.observe((data) => {
    if (commonService.mode.value == "Visualize") {
      const newData = commonService.firstSet.value;
      createHistogramType(Array.from(new Set(newData.map((obj) => obj.Type))), newData);
      createHistogramContentRating(Array.from(new Set(newData.map((obj) => obj.Content_Rating))), newData);
    }
  });

  function initializeHistograms(jsonData) {
    createHistogramType(Array.from(new Set(jsonData.map((obj) => obj.Type))), jsonData);
    createHistogramContentRating(Array.from(new Set(jsonData.map((obj) => obj.Content_Rating))), jsonData);
    createHistogramInstalls(jsonData.map((obj) => ({ Installs: parseInt(obj.Installs) })));
  }
}
