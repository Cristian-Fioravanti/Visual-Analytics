import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";

// main();
let allDataInstalls;

function main() {
  // createHistogramShort(1,dataSet);
  // createHistogramShort(2,dataSet);
  // createHistogramLong(3,dataSet);
}

export function createHistogramShortInstalls1(i, dataDistinct, data) {
  
  var dataSet = data!=undefined ? data : [] ;
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#Histogram" + i).select("svg").select("g.ShortInstalls")
  if(svg.empty()) {
    var svg = d3
    .select("#Histogram" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .classed("ShortInstalls", true)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  // get the data

  // X axis: scale and draw:
  var xTickFormat = function (d) {
    return "10^" + Math.round(Math.log10(d));
  };
  var domainX = dataDistinct.length!=0 ? d3.max(dataDistinct.map(item => item.Installs)) : 100000000000
  domainX = domainX.toString().charAt(0) == '5' ? domainX*2 : domainX
  var x = d3
    .scaleLog()
    .domain([1, domainX]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width]);
  var xAxis = svg.select("g.x.axis")
  if(xAxis.empty()) {
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(xTickFormat));
    } else {
      xAxis.attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(xTickFormat));
  }
  
  // set the parameters for the histogram
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d.Installs;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(10)); // then the numbers of bins
  // And apply this function to data to get the bins
  var bins = histogram(dataSet);
  // Y axis: scale and draw:
  var y = d3.scaleLinear().range([height, 0]);
  y.domain([0,d3.max(bins, function (d) {return d.length;}),]); 
  // d3.hist has to be called before the Y axis obviously

  // var domainY = dataSet.length!=0 ? dataSet.length : 7023
  // var y = d3.scaleLinear().range([height, 0]).domain([0, domainY]);
  function generateCustomTicks(y) {
    var tickValues = [y.domain()[0]];
    var currentValue = y.domain()[1];

    while (currentValue > 10) {
        currentValue /= 2;
        tickValues.push(currentValue);
    }
    tickValues.push(y.domain()[1]);
    return tickValues;
  }
  var yAxis = svg.select("g.HistogramSvg"+i)
  if(yAxis.empty()) {
    svg
      .append("g")
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)))
      .attr("class", "HistogramSvg" + i);
  } else {
    yAxis.call(d3.axisLeft(y).tickValues(generateCustomTicks(y)))
    .attr("class", "HistogramSvg" + i);
  }
  // popolaTabella(bins);

  function popolaTabella(data) {
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
    .style("fill", "#69b3a2");
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
      .style("fill", "#69b3a2");
  }
  popolaTabella([]);
  // const dataType = Array.from(new Set(dataSet.map((obj) => obj.Installs))).map((Installs) => ({ Installs, Total: dataSet.filter((x) => x.Installs === Installs).length }));
  // popolaTabella(dataType)
  popolaTabella(histogram(dataSet.map((obj) => ({ Installs: parseInt(obj.Installs) }))));
}

export function createHistogramShortInstalls(i, dataSet) {
  allDataInstalls = dataSet
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#Histogram" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .classed("ShortInstalls", true)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // get the data

  // X axis: scale and draw:
  var xTickFormat = function (d) {
    return "10^" + Math.round(Math.log10(d));
  };
  var x = d3
    .scaleLog()
    .domain([1, 100000000000]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "HistogramSvg" + i)
    .call(d3.axisBottom(x).tickFormat(xTickFormat));

  // set the parameters for the histogram
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d.Installs;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(10)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(dataSet);

  // Y axis: scale and draw:

  var y = d3.scaleLinear().range([height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); // d3.hist has to be called before the Y axis obviously
  svg.append("g").attr("class","installsY").call(d3.axisLeft(y));

  // popolaTabella(bins);

  function popolaTabella(data) {
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
    .style("fill", "#69b3a2");
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
      .style("fill", "#69b3a2");
  }
  commonService.firstSet.observe((data) => {
    // And apply this function to data to get the bins
    dataSet = commonService.firstSet!=undefined ? commonService.firstSet.value : allDataInstalls
    bins = histogram(dataSet);
    // Y axis: scale and draw:
    y = d3.scaleLinear().range([height, 0]);
    y.domain([0,d3.max(bins, function (d) {return d.length;}),
    ]); // d3.hist has to be called before the Y axis obviously
    svg.select("g.installsY").call(d3.axisLeft(y));
    popolaTabella([]);
    popolaTabella(histogram(commonService.firstSet.value.map((obj) => ({ Installs: parseInt(obj.Installs) }))));
  });
}

export function createHistogramShortType(i, dataDistinct, data) {
  // d3.select("#Histogram" + i).select("g.x.axis").remove()
  // d3.select("#Histogram" + i).select("g.HistogramSvg"+i).remove()
  // d3.select("#Histogram" + i).selectAll("rect").remove()
  var dataSet = data!=undefined ? data : [] ;
  function popolaTabella(data) {
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
      .style("fill", "#69b3a2");
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
      .style("fill", "#69b3a2");
  }
  
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 298 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#Histogram" + i).select("svg").select("g.ShortTicks")
  if(svg.empty()) {
    var svg = d3
      .select("#Histogram" + i)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .classed("ShortTicks", true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  // X axis: scale and draw:
  var domainX = dataDistinct.length!=0 ? dataDistinct : ["Free", "Paid"]
  var x = d3
    .scalePoint()
    .domain(domainX) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width])
    .padding(1);
  var xAxis = svg.select("g.x.axis")
  if(xAxis.empty()) {
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  } else {
    xAxis.attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  }
  // Y axis: scale and draw:
  var domainY = dataSet.length!=0 ? dataSet.length : 7023
  var y = d3.scaleSymlog().range([height, 0]).domain([0, domainY]);
  function generateCustomTicks(y) {
    var tickValues = [y.domain()[0]];
    var currentValue = y.domain()[1];

    while (currentValue > 10) {
        currentValue /= 2;
        tickValues.push(currentValue);
    }
    tickValues.push(y.domain()[1]);
    return tickValues;
  }

  var yAxis = svg.select("g.HistogramSvg"+i)
  if(yAxis.empty()) {
    svg
      .append("g")
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
      .attr("class", "HistogramSvg" + i);
  } else {
    yAxis.call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
    .attr("class", "HistogramSvg" + i);
  }
  popolaTabella([]);
  const dataType = Array.from(new Set(dataSet.map((obj) => obj.Type))).map((Type) => ({ Type, Total: dataSet.filter((x) => x.Type === Type).length }));
  popolaTabella(dataType);
}

export function createHistogramShortContentRating(i, dataDistinct, data) {

  var dataSet = data!=undefined ? data : [] ;
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 298 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;

  var svg = d3.select("#Histogram" + i).select("svg").select("g.ContentRating")
  if(svg.empty()) {
    // append the svg object to the body of the page
    var svg = d3
      .select("#Histogram" + i)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g").classed("ContentRating",true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  var domainX = dataDistinct.length!=0 ? dataDistinct : ["Everyone", "Teen", "Adults Only"]
  // X axis: scale and draw:
  var x = d3
    .scalePoint()
    .domain(domainX) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width])
    .padding(1);
  var xAxis = svg.select("g.x.axis")
  if(xAxis.empty()) {
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  } else {
    xAxis.attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  }

  // Y axis: scale and draw:
  var domainY = dataSet.length!=0 ? dataSet.length : 7023
  var y = d3.scaleSymlog().range([height, 0]).domain([0, domainY]);
  function generateCustomTicks(y) {
    var tickValues = [y.domain()[0]];
    var currentValue = y.domain()[1];

    while (currentValue > 10) {
        currentValue /= 2;
        tickValues.push(currentValue);
    }

    tickValues.push(y.domain()[1]);

    return tickValues;
  }
  var yAxis = svg.select("g.HistogramSvg"+i)
  if(yAxis.empty()) {
    svg
      .append("g")
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
      .attr("class", "HistogramSvg" + i);
  } else {
    yAxis.call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
    .attr("class", "HistogramSvg" + i);
  }
  
  function popolaTabella(data) {
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
      var transX = x(d.Content_Rating) - 5
      return "translate(" + transX + "," + y(d.Total) + ")";
    })
    .attr("width", function (d) {
      return 10;
    })
    .attr("height", function (d) {
      return height - y(d.Total);
    })
    .style("fill", "#69b3a2");
  }
  function updateData(update) {
    update
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        var transX = parseInt(x(d.Content_Rating)) - 5
        return "translate(" + transX + "," + y(d.Total) + ")";
      })
      .attr("width", function (d) {
        return 10;
      })
      .attr("height", function (d) {
        return height - y(d.Total);
      })
      .style("fill", "#69b3a2");
  }
  popolaTabella([]);
  const dataContent_Rating = Array.from(new Set(dataSet.map((obj) => obj.Content_Rating))).map((Content_Rating) => ({ Content_Rating, Total: dataSet.filter((x) => x.Content_Rating === Content_Rating).length }));
  popolaTabella(dataContent_Rating);
}

export function populateHistograms() {
  initializeHistograms()
  commonService.firstSet.observe((data) => {
    var newData = commonService.firstSet.value;
    const dataInstalls = newData.map(obj => ({ Installs: parseInt(obj.Installs) }));

    const dataType = Array.from(new Set(newData.map(obj => obj.Type)))
      .map(Type => ({ Type, Total: newData.filter(x => x.Type === Type).length }));

    const dataContentRating = Array.from(new Set(newData.map(obj => obj.Content_Rating)))
      .map(ContentRating => ({
        ContentRating,
        Total: newData.filter(x => x.Content_Rating === ContentRating).length
      }));

    const heightY = newData.length;

    createHistogramShortType(1, Array.from(new Set(newData.map(obj => obj.Type))), newData);
    createHistogramShortContentRating(2, Array.from(new Set(newData.map(obj => obj.Content_Rating))), newData);
    // createHistogramShortInstalls(3, dataInstalls, newData);
  })

  function initializeHistograms() {
    createHistogramShortType(1, [], undefined);
    createHistogramShortContentRating(2, [], undefined);
    // createHistogramShortInstalls(3, [], undefined);
    createHistogramShortInstalls(3, []);
  }
}
