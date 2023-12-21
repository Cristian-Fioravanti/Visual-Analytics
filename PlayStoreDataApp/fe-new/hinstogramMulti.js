import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";
import * as categoryService from "./category.js";

let allDataInstalls;

export function createHistogramInstalls(dataSet) {
  allDataInstalls = dataSet;
  // set the dimensions and margins of the graph
  let divWidth = d3.select(".Histogram3").node().clientWidth;
  let divHeigth = d3.select(".Histogram3").node().clientHeight;
  let margin = { top: 20, right: 15, bottom: 30, left: 40 },
    width = divWidth - margin.left - margin.right,
    height = divHeigth - margin.top - margin.bottom;
  let y;
  let x;

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
     var containerY = d3.event.clientY - d3.select("#Histogram3").node().getBoundingClientRect().top- margin.top;
    
    // Calcola le coordinate y relative al grafico
    var mouseY = y.invert(containerY);
    
    // Aggiungi il testo desiderato nel tooltip
    tooltip.html(d.length)
      .style("left", x(d.x0)-24 + "px")
       // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", y(mouseY) -30+ "px")
      .style("transform", "translate(" + x(d.x0) + ",0)")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  let mouseleave = function(d) {
    tooltip.style("opacity", 0)
    
  }  
  // append the svg object to the body of the page
  let svg = d3.select("#Histogram3").select("svg").select("g.ShortInstalls");
  if (svg.empty()) {
    svg = d3.select("#Histogram3")
      .append("svg")
      .attr("width", divWidth - 1)
      .attr("height", divHeigth - 1)
      .append("g")
      .classed("ShortInstalls", true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  // get the data

  // X axis: scale and draw:
  let xTickFormat = function (d) {
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
  let histogram = d3.histogram()
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
  let yAxis = svg.select("g.installsY")
  if(yAxis.empty()) {
    svg.append("g").attr("class", "installsY").call(d3.axisLeft(y));
  } else {
    yAxis.call(d3.axisLeft(y));
  } 

  // popolaTabella(bins);

  function popolaTabella(firstGroup, secondGroup) {
    const svg = d3.select(".ShortInstalls");
    svg.selectAll("rect").remove();
    svg.selectAll("text.bar-text").remove();
    if (categoryService.firstCategory != null) {
      var color1 = commonService.scaleColor(categoryService.firstCategory);
    } else {
      var color1 = "#cb2322";
    }
    if (categoryService.secondCategory != null) {
      var color2 = commonService.scaleColor(categoryService.secondCategory);
    } else {
      var color2 = "#00e3fd";
    }
    var groups = []
    for (let i = 0; i < firstGroup.length; i++) {
      const firstLength = firstGroup[i].length
      const secondLength = secondGroup[i].length
      if(firstLength>secondLength) {
        groups.push({
          length: firstLength,
          x0 : firstGroup[i].x0,
          x1 : firstGroup[i].x1,
          color: color1
        });
        groups.push({
          length: secondLength,
          x0 : firstGroup[i].x0,
          x1 : firstGroup[i].x1,
          color: color2
        });
      } else {
        groups.push({
          length: secondLength,
          x0 : firstGroup[i].x0,
          x1 : firstGroup[i].x1,
          color: color2
        });
        groups.push({
          length: firstLength,
          x0 : firstGroup[i].x0,
          x1 : firstGroup[i].x1,
          color: color1
        });
      }
    }
    const rects = svg
      .selectAll("rect")
      .data(groups)
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
      .attr("class", "firstGroup")
      .style("fill", function (d) {
        return d.color;
      })
      .style("opacity",0.6).on("mouseover", mouseover )
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
      .style("fill", "yellow").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }

  popolaTabella([], []);
  commonService.firstSet.observe((data) => {
    if (commonService.mode.value == "Compare") {
      // And apply this function to data to get the bins
      let firstGroup = commonService.firstSet.value != undefined ? commonService.firstSet.value : [];
      let secondGroup = commonService.secondSet.value != undefined ? commonService.secondSet.value : [];
      let dataSet = [...firstGroup, ...secondGroup];
      if(dataSet.length==0) {
        let bins = histogram(allDataInstalls) 
        var maxY = d3.max(bins, function (d) {return d.length;})
      } else {
        let bins1 = histogram(firstGroup);
        let bins2 = histogram(secondGroup);
        let maxY1 = d3.max(bins1, function (d) {return d.length;})
        let maxY2 = d3.max(bins2, function (d) {return d.length;})
        var maxY = d3.max([maxY1,maxY2])
      }
      // Y axis: scale and draw:
      y = d3.scaleLinear().range([height, 0]);
      y.domain([0,maxY]);
      let yAxis = svg.select("g.installsY")
      if(yAxis.empty()) {
        svg.append("g").attr("class", "installsY").call(d3.axisLeft(y));
      } else {
        yAxis.call(d3.axisLeft(y));
      }
      popolaTabella([], []);
      if (dataSet.length != 0) {
        popolaTabella(
          histogram(
            firstGroup.map((obj) => ({ Installs: parseInt(obj.Installs) }))
          ),
          histogram(
            secondGroup.map((obj) => ({ Installs: parseInt(obj.Installs) }))
          )
        );
      }
    }
  });
  commonService.secondSet.observe((data) => {
    if (commonService.mode.value == "Compare") {
      // And apply this function to data to get the bins
      let firstGroup =
        commonService.firstSet.value != undefined
          ? commonService.firstSet.value
          : [];
      let secondGroup =
        commonService.secondSet.value != undefined
          ? commonService.secondSet.value
          : [];
      let dataSet = [...firstGroup, ...secondGroup];
      if(dataSet.length==0) {
        let bins1 = histogram(allDataInstalls) 
        var maxY = d3.max(bins, function (d) {return d.length;})
      } else {
        let bins1 = histogram(firstGroup);
        let bins2 = histogram(secondGroup);
        let maxY1 = d3.max(bins1, function (d) {return d.length;})
        let maxY2 = d3.max(bins2, function (d) {return d.length;})
        var maxY = d3.max([maxY1,maxY2])
      }
      // Y axis: scale and draw:
      y = d3.scaleLinear().range([height, 0]);
      y.domain([0,maxY]); // d3.hist has to be called before the Y axis obviously
      let yAxis = svg.select("g.installsY")
      if(yAxis.empty()) {
        svg.append("g").attr("class", "installsY").call(d3.axisLeft(y));
      } else {
        yAxis.call(d3.axisLeft(y));
      }
      popolaTabella([], []);
      if (dataSet.length != 0) {
        popolaTabella(
          histogram(
            firstGroup.map((obj) => ({ Installs: parseInt(obj.Installs) }))
          ),
          histogram(
            secondGroup.map((obj) => ({ Installs: parseInt(obj.Installs) }))
          )
        );
      }
    }
  });
}

export function createHistogramType(dataDistinct, data1, data2) {
  var dataSet = [...data1, ...data2];
  var y;
  var tooltip = d3.select("#Histogram1").select("span.tooltip")
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

  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    var containerY = d3.event.clientY - d3.select(".Histogram1").node().getBoundingClientRect().top- margin.top;
    
    // Calcola le coordinate y relative al grafico
    var mouseY = y.invert(containerY)

    // Aggiungi il testo desiderato nel tooltip
    tooltip
        .html(d.Total)
      .style("left", (d3.event.clientX+10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.event.clientY-50) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip.style("opacity", 0)
    
  }  
  function popolaTabella(firstGroup, secondGroup) {
    // Seleziona l'elemento SVG o il contenitore appropriato
    const svg = d3.select(".ShortTicks");
    svg.selectAll("rect").remove();
    
    if (categoryService.firstCategory != null) {
      var color1 = commonService.scaleColor(categoryService.firstCategory);
    } else {
      var color1 = "#cb2322";
    }
    if (categoryService.secondCategory != null) {
      var color2 = commonService.scaleColor(categoryService.secondCategory);
    } else {
      var color2 = "#00e3fd";
    }
    var y
  
    // Seleziona tutti i rettangoli nel contenitore e associa i dati combinati
    const rects1 = svg
      .selectAll("rect.firstGroup")
      .data(firstGroup)
      .join(
        function (enter) {
          enterData(enter, 1, color1);
        },
        function (update) {
          updateData(update);
        }
      );
    const rects2 = svg
      .selectAll("rect.secondGroup")
      .data(secondGroup)
      .join(
        function (enter) {
          enterData(enter, 2, color2);
        },
        function (update) {
          updateData(update);
        }
      );
  }

  function enterData(enter, group, color) {
    // Aggiungi rettangoli per il primo gruppo
    if (group == 1) {
      enter
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) {
          return "translate(" + (x(d.Type) - 10) + "," + y(d.Total) + ")";
        })
        .attr("width", 10)
        .attr("height", function (d) {
          return height - y(d.Total);
        })
        .attr("class", "firstGroup")
        .style("fill", color).on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
    } else {
      enter
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) {
          return "translate(" + x(d.Type) + "," + y(d.Total) + ")";
        })
        .attr("width", 10)
        .attr("height", function (d) {
          return height - y(d.Total);
        })
        .attr("class", "secondGroup")
        .style("fill", color).on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
    }
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
      .style("fill", "yellow").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }

  // set the dimensions and margins of the graph
  var divWidth = d3.select(".Histogram1").node().clientWidth;
  var divHeigth = d3.select(".Histogram1").node().clientHeight;
  var margin = { top: 10, right: 5, bottom: 30, left: 40 },
    width = divWidth - margin.left - margin.right,
    height = divHeigth - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#Histogram1").select("svg").select("g.ShortTicks");
  if (svg.empty()) {
    var svg = d3
      .select("#Histogram1")
      .append("svg")
      .attr("width", divWidth - 1)
      .attr("height", divHeigth - 1)
      .append("g")
      .classed("ShortTicks", true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  // X axis: scale and draw:
  let domainX =
    dataDistinct.length != 0
      ? dataDistinct.sort(d3.ascending)
      : ["Free", "Paid"];
  var x = d3
    .scalePoint()
    .domain(domainX) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width])
    .padding(1);
  var xAxis = svg.select("g.x.axis");
  if (xAxis.empty()) {
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  } else {
    xAxis
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  }
  // Y axis: scale and draw:
  var domainY = dataSet.length != 0 ? dataSet.length : 7023;
  y = d3.scaleSymlog().range([height, 0]).domain([0, domainY]);
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

  var yAxis = svg.select("g.HistogramSvg1");
  if (yAxis.empty()) {
    svg
      .append("g")
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
      .attr("class", "HistogramSvg1");
  } else {
    yAxis
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
      .attr("class", "HistogramSvg1");
  }
  popolaTabella([], []);
  const firstGroup = Array.from(new Set(data1.map((obj) => obj.Type))).map(
    (Type) => ({ Type, Total: data1.filter((x) => x.Type === Type).length })
  );
  const secondGroup = Array.from(new Set(data2.map((obj) => obj.Type))).map(
    (Type) => ({ Type, Total: data2.filter((x) => x.Type === Type).length })
  );
  popolaTabella(firstGroup, secondGroup);
}

export function createHistogramContentRating(dataDistinct, data1, data2) {
  var dataSet = [...data1, ...data2];

  // set the dimensions and margins of the graph
  var divWidth = d3.select(".Histogram2").node().clientWidth;
  var divHeigth = d3.select(".Histogram2").node().clientHeight;
  var margin = { top: 10, right: 5, bottom: 30, left: 40 },
    width = 350 - margin.left - margin.right,
    height = 165 - margin.top - margin.bottom;
  var y;
  var tooltip = d3.select("#Histogram2").select("span.tooltip")
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

  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    var containerY = d3.event.clientY - d3.select(".Histogram2").node().getBoundingClientRect().top- margin.top;
    
    // Calcola le coordinate y relative al grafico
    var mouseY = y.invert(containerY)

    // Aggiungi il testo desiderato nel tooltip
    tooltip
        .html(d.Total)
      .style("left", (d3.event.clientX+10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.event.clientY-50) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip.style("opacity", 0)
    
  }  
  var svg = d3.select("#Histogram2").select("svg").select("g.ContentRating");
  if (svg.empty()) {
    // append the svg object to the body of the page
    var svg = d3
      .select("#Histogram2")
      .append("svg")
      .attr("width", divWidth - 1)
      .attr("height", divHeigth - 1)
      .append("g")
      .classed("ContentRating", true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  var domainX =
    dataDistinct.length != 0
      ? dataDistinct
      : ["Everyone", "Teen", "Adults Only"];
  // X axis: scale and draw:
  var x = d3
    .scalePoint()
    .domain(domainX) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width])
    .padding(1);
  var xAxis = svg.select("g.x.axis");
  if (xAxis.empty()) {
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  } else {
    xAxis
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  }

  // Y axis: scale and draw:
  var domainY = dataSet.length != 0 ? dataSet.length : 7023;
  y = d3.scaleSymlog().range([height, 0]).domain([0, domainY]);
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
  var yAxis = svg.select("g.HistogramSvg2");
  if (yAxis.empty()) {
    svg
      .append("g")
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
      .attr("class", "HistogramSvg2");
  } else {
    yAxis
      .call(d3.axisLeft(y).tickValues(generateCustomTicks(y)).tickSizeOuter(0))
      .attr("class", "HistogramSvg2");
  }

  function popolaTabella(firstGroup, secondGroup) {
    // Seleziona l'elemento SVG o il contenitore appropriato
    const svg = d3.select(".ContentRating");
    svg.selectAll("rect").remove();
    if (categoryService.firstCategory != null) {
      var color1 = commonService.scaleColor(categoryService.firstCategory);
    } else {
      var color1 = "#cb2322";
    }
    if (categoryService.secondCategory != null) {
      var color2 = commonService.scaleColor(categoryService.secondCategory);
    } else {
      var color2 = "#00e3fd";
    }
    // Seleziona tutti i rettangoli nel contenitore e associa i dati combinati
    const rects1 = svg
      .selectAll("rect.firstGroup")
      .data(firstGroup)
      .join(
        function (enter) {
          enterData(enter, 1, color1);
        },
        function (update) {
          updateData(update);
        }
      );
    const rects2 = svg
      .selectAll("rect.secondGroup")
      .data(secondGroup)
      .join(
        function (enter) {
          enterData(enter, 2, color2);
        },
        function (update) {
          updateData(update);
        }
      );
  }

  function enterData(enter, group, color) {
    // Aggiungi rettangoli per il primo gruppo
    if (group == 1) {
      enter
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) {
          return (
            "translate(" + (x(d.Content_Rating) - 10) + "," + y(d.Total) + ")"
          );
        })
        .attr("width", 10)
        .attr("height", function (d) {
          return height - y(d.Total);
        })
        .attr("class", "firstGroup")
        .style("fill", color).on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
    } else {
      enter
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) {
          return "translate(" + x(d.Content_Rating) + "," + y(d.Total) + ")";
        })
        .attr("width", 10)
        .attr("height", function (d) {
          return height - y(d.Total);
        })
        .attr("class", "secondGroup")
        .style("fill", color).on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
    }
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
      .style("fill", "yellow").on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );
  }
  popolaTabella([], []);
  const firstGroup = Array.from(
    new Set(data1.map((obj) => obj.Content_Rating))
  ).map((Content_Rating) => ({
    Content_Rating,
    Total: data1.filter((x) => x.Content_Rating === Content_Rating).length,
  }));
  const secondGroup = Array.from(
    new Set(data2.map((obj) => obj.Content_Rating))
  ).map((Content_Rating) => ({
    Content_Rating,
    Total: data2.filter((x) => x.Content_Rating === Content_Rating).length,
  }));
  popolaTabella(firstGroup, secondGroup);
}

export function populateHistograms(jsonData) {
  initializeHistograms(jsonData);
  commonService.firstSet.observe((data) => {
    if (commonService.mode.value == "Compare") {
      var firstGroup =
        commonService.firstSet.value != undefined
          ? commonService.firstSet.value
          : [];
      var secondGroup =
        commonService.secondSet.value != undefined
          ? commonService.secondSet.value
          : [];
      var grouped = [...firstGroup, ...secondGroup];
      createHistogramType(
        Array.from(new Set(grouped.map((obj) => obj.Type))),
        firstGroup,
        secondGroup
      );
      createHistogramContentRating(
        Array.from(new Set(grouped.map((obj) => obj.Content_Rating))),
        firstGroup,
        secondGroup
      );
    }
  });
  commonService.secondSet.observe((data) => {
    if (commonService.mode.value == "Compare") {
      var firstGroup =
        commonService.firstSet.value != undefined
          ? commonService.firstSet.value
          : [];
      var secondGroup =
        commonService.secondSet.value != undefined
          ? commonService.secondSet.value
          : [];
      var grouped = [...firstGroup, ...secondGroup];
      createHistogramType(
        Array.from(new Set(grouped.map((obj) => obj.Type))),
        firstGroup,
        secondGroup
      );
      createHistogramContentRating(
        Array.from(new Set(grouped.map((obj) => obj.Content_Rating))),
        firstGroup,
        secondGroup
      );
    }
  });

  function initializeHistograms(jsonData) {
    createHistogramType(
      Array.from(new Set(jsonData.map((obj) => obj.Type))),
      [],
      []
    );
    createHistogramContentRating(
      Array.from(new Set(jsonData.map((obj) => obj.Content_Rating))),
      [],
      []
    );
    createHistogramInstalls(
      jsonData.map((obj) => ({ Installs: parseInt(obj.Installs) }))
    );
  }
}
