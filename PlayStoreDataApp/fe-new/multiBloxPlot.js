import "https://d3js.org/d3.v5.min.js";
import "./interface.js";
import * as commonService from "./commonService.js";

let ListPlayStoreData = [];
main();

function main() {
  // createBoxPlot(1);
  // createBoxPlot(2);
  // createBoxPlot(3);
  // createBoxPlot(4);
}

function populateBoxplots() {
  // console.log("Rating",data.map(item => item.Rating))
  // console.log("Reviews",data.map(item => item.Reviews))
  // console.log("Installations",data.map(item => item.Installs))
  // console.log("Size",data.map(item => item.Size))
  
  commonService.firstSet.observe((data) => {
    var newData = commonService.firstSet.value;
    var secondGroup = commonService.secondSet.value;
    let data1 = newData.map(item => item.Rating)
    let data11 = secondGroup!= undefined ? secondGroup.map(item => item.Rating) : undefined
    createBoxPlot(data1, data11, 1, "Ratings")
    let data2  = newData.map(item => item.Reviews)
    let data21 = secondGroup!= undefined ? secondGroup.map(item => item.Reviews) : undefined
    createBoxPlot(data2, data21, 2, "Reviews")
    let data3 = newData.map(item => item.Installs)
    let data31 = secondGroup!= undefined ? secondGroup.map(item => item.Installs) : undefined
    createBoxPlot(data3, data31, 3, "Installs")
    let data4 = newData.map(item => item.Size)
    let data41 = secondGroup!= undefined ? secondGroup.map(item => item.Size) : undefined
    createBoxPlot(data4, data41, 4, "Size")
  });
  commonService.secondSet.observe((data) => {
    var newData = commonService.secondSet.value;
    var firstGroup = commonService.firstSet.value;
    let data1 = newData.map(item => item.Rating)
    let data11 = firstGroup.map(item => item.Rating)
    createBoxPlot(data11, data1, 1, "Ratings")
    let data2  = newData.map(item => item.Reviews)
    let data21 = firstGroup.map(item => item.Reviews)
    createBoxPlot(data21, data2, 2, "Reviews")
    let data3 = newData.map(item => item.Installs)
    let data31 = firstGroup.map(item => item.Installs)
    createBoxPlot(data31, data3, 3, "Installs")
    let data4 = newData.map(item => item.Size)
    let data41 = firstGroup.map(item => item.Size)
    createBoxPlot(data41, data4, 4, "Size")
  });
  
  
};

function createBoxPlot(group1, group2, i, title) {
  // set the dimensions and margins of the graph
  var margin = { top: 70, right: 0, bottom: 35, left: 40 },
    width = 298 - margin.left - margin.right,
    height = 167 - margin.top - margin.bottom;

  var svg = d3.select("#boxPlot" + i).select("svg")
  if(svg.empty()) {
    svg = d3
    .select("#boxPlot" + i)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  // append the svg object to the body of the page
  // Compute summary statistics used for the box:
  if(group1 != undefined) {
    var data_sorted1 = group1.sort(d3.ascending);
    var q11 = d3.quantile(data_sorted1, 0.25);
    var median1 = d3.quantile(data_sorted1, 0.5);
    var q31 = d3.quantile(data_sorted1, 0.75);
    var min1 = d3.min(data_sorted1);
    var max1 = d3.max(data_sorted1);
  }
  if(group1 != undefined && group2 != undefined) {
    var groupedData = group1.concat(group2)
    var data_sorted2 = group2.sort(d3.ascending);
    var q12 = d3.quantile(data_sorted2, 0.25);
    var median2 = d3.quantile(data_sorted2, 0.5);
    var q32 = d3.quantile(data_sorted2, 0.75);
    var min2 = d3.min(data_sorted2);
    var max2 = d3.max(data_sorted2);
    var min = d3.min(groupedData);
    var max = d3.max(groupedData);
  } else if(group1 != undefined && group2 == undefined) {
    var min = d3.min(data_sorted1);
    var max = d3.max(data_sorted1);
  }
  

  // Show the Y scale
  if(max-min<10)
    var y = d3.scaleLinear().domain([min, max]).range([height+margin.top, 0]);  
  else
    var y = d3.scaleLog().domain([1, max]).range([height+margin.top, 0]);
  
  // Show the X scale
  var x = d3.scaleBand()
    .range([ margin.left, width ])
    .domain(["Group 1", "Group 2"])
    
  var powerLabels = d3
    .range(0, Math.ceil(Math.log10(max)+1))
    .map(function(d) { return Math.pow(10, d); });
  var yAxisFormat = d3.format("");
  if(max>10) {
    var yAxis = d3.axisLeft(y)
      .tickValues(powerLabels)
      .tickFormat(yAxisFormat);
  } else {
    var yAxis = d3.axisLeft(y)
    .tickFormat(yAxisFormat);
  }  

  // a few features for the box
  // var center = 200;
  var boxWidth = 75;
  var click = function (d) {
    if (d == min) {
      svg.select(".down");
      var isSelected = svg.select(".down").classed("selectedBoxPlotLine");

      // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
      if (isSelected) {
        svg.select(".down").classed("selectedBoxPlotLine", false);
      } else {
        svg.select(".down").classed("selectedBoxPlotLine", true);
      }
    }
    else if(d==max) {
      svg.select(".up");
      var isSelected = svg.select(".up").classed("selectedBoxPlotLine");

      // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
      if (isSelected) {
        svg.select(".up").classed("selectedBoxPlotLine", false);
      } else {
        svg.select(".up").classed("selectedBoxPlotLine", true);
      }
    }
    if (d != median) {
    var isSelected = d3.select(this).classed("selectedBoxPlotLine");

    // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
    if (isSelected) {
      d3.select(this).classed("selectedBoxPlotLine", false);
    } else {
      d3.select(this).classed("selectedBoxPlotLine", true);
    }
    }
    
  };

  var removePointerInMiddle = function (d) {
    if (d == median) {
      d3.select(this).classed("toto", false)
    }
  }

  var clickRect = function (d) { 
    var isSelected = d3.select(this).classed("selectedBoxPlotRect");

    // Verifica se la classe "selectedHeatMap" è già presente e agisci di conseguenza
    if (isSelected) {
      d3.select(this).classed("selectedBoxPlotRect", false);
    } else {
      d3.select(this).classed("selectedBoxPlotRect", true);
    }
   
  }

  if(median1 != undefined && q31 != undefined && q11 != undefined) {
    d3.select("#boxPlot" + i).select("g.y.axis").remove()
    d3.select("#boxPlot" + i).select("g.x.axis").remove()
    d3.select("#boxPlot" + i).selectAll("rect").remove()
    d3.select("#boxPlot" + i).selectAll("line").remove()
    d3.select("#boxPlot" + i).selectAll("toto").remove()
    d3.select("#boxPlot" + i).selectAll("text").remove()
    
    var newTopX = height+margin.top
    // var newTopY = margin.top-20
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+ 0 + ","+  newTopX +")")
      .call(d3.axisBottom(x))
    // Show the box
    // Show the first box (sopra la linea median)
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ","+  0+ ")")
      .call(yAxis);

    svg
      .append("rect")
      .attr("x", x("Group 1")-boxWidth/2+ x.bandwidth()/2)
      .attr("y", y(q31))
      .attr("height", y(median1) - y(q31))  // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 0, 0,0.5)")
      .classed("selectedBoxPlotRect", true)
      .on("click", clickRect);

    // Show the second box (sotto la linea median)
    svg.append("rect")
      .attr("x", x("Group 1")-boxWidth/2+ x.bandwidth() / 2)
      .attr("y", y(median1))
      .attr("height", y(q11) - y(median1))  // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 0, 0,0.5)")
      .classed("selectedBoxPlotRect", true)
      .on("click", clickRect);
    
    // svg.selectAll("rect").classed("selectedBoxPlotRect", true)

    // show median, min and max horizontal lines
    svg
      .selectAll("toto")
      .data([min1, median1, max1])
      .enter()
      .append("line")
      .attr("x1", x("Group 1")-boxWidth/2+ x.bandwidth() / 2)
      .attr("x2", x("Group 1")+boxWidth/2+ x.bandwidth() / 2)
      .attr("y1", function (d) {
        return y(d);
      })
      .attr("y2", function (d) {
        return y(d);
      })
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .classed("toto",true);
    
    // Show the upper vertical line
    svg
      .append("line")
      .attr("x1", x("Group 1")+ x.bandwidth() / 2)
      .attr("x2", x("Group 1")+ x.bandwidth() / 2)
      .attr("y1", y(min1))
      .attr("y2", y(q11)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("down", true);

    // Show the lower vertical line
    svg
      .append("line")
      .attr("x1", x("Group 1")+ x.bandwidth() / 2)
      .attr("x2", x("Group 1")+ x.bandwidth() / 2)
      .attr("y1", y(q31)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("y2", y(max1))
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("up", true);
    
    // Rettangolo parte alta 
    svg.append("rect")
      .attr("x", x("Group 1") - boxWidth / 2+ x.bandwidth() / 2)
      .attr("y", y(max1))
      .attr("height", y(q31) - y(max1))  // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 0, 0,0)")
      .on("click", clickRect);

    // Show the second box (sotto la linea median)
    svg.append("rect")
      .attr("x", x("Group 1") - boxWidth / 2+ x.bandwidth() / 2)
      .attr("y", y(q11))
      .attr("height", y(min1) - y(q11))  // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("cursor", "pointer")
      .style("fill", "rgb(255, 0, 0,0)")
      .on("click", clickRect);  
  }
  if(median2 != undefined && q32 != undefined && q12 != undefined) {
    svg
      .append("rect")
      .attr("x", x("Group 2")-boxWidth/2+ x.bandwidth()/2)
      .attr("y", y(q32))
      .attr("height", y(median2) - y(q32))  // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .attr("cursor", "pointer")
      .style("fill", "rgb(0, 0, 255,0.5)")
      .classed("selectedBoxPlotRect", true)
      .on("click", clickRect);

    // Show the second box (sotto la linea median)
    svg.append("rect")
      .attr("x", x("Group 2")-boxWidth/2+ x.bandwidth() / 2)
      .attr("y", y(median2))
      .attr("height", y(q12) - y(median2))  // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .attr("cursor", "pointer")
      .style("fill", "rgb(0, 0, 255,0.5)")
      .classed("selectedBoxPlotRect", true)
      .on("click", clickRect);
    
    // svg.selectAll("rect").classed("selectedBoxPlotRect", true)

    // show median, min and max horizontal lines
    svg
      .selectAll("toto")
      .data([min2, median2, max2])
      .enter()
      .append("line")
      .attr("x1", x("Group 2")-boxWidth/2+ x.bandwidth() / 2)
      .attr("x2", x("Group 2")+boxWidth/2+ x.bandwidth() / 2)
      .attr("y1", function (d) {
        return y(d);
      })
      .attr("y2", function (d) {
        return y(d);
      })
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .classed("toto",true);
    
    // Show the upper vertical line
    svg
      .append("line")
      .attr("x1", x("Group 2")+ x.bandwidth() / 2)
      .attr("x2", x("Group 2")+ x.bandwidth() / 2)
      .attr("y1", y(min2))
      .attr("y2", y(q12)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("down", true);

    // Show the lower vertical line
    svg
      .append("line")
      .attr("x1", x("Group 2")+ x.bandwidth() / 2)
      .attr("x2", x("Group 2")+ x.bandwidth() / 2)
      .attr("y1", y(q32)) // Puoi regolare questa coordinata per adattarla al tuo grafico
      .attr("y2", y(max2))
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .classed("up", true);
    
    // Rettangolo parte alta 
    svg.append("rect")
      .attr("x", x("Group 2") - boxWidth / 2+ x.bandwidth() / 2)
      .attr("y", y(max2))
      .attr("height", y(q32) - y(max2))  // Lato più lungo in basso deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("cursor", "pointer")
      .style("fill", "rgb(0, 0, 255,0)")
      .on("click", clickRect);

    // Show the second box (sotto la linea median)
    svg.append("rect")
      .attr("x", x("Group 2") - boxWidth / 2+ x.bandwidth() / 2)
      .attr("y", y(q12))
      .attr("height", y(min2) - y(q12))  // Lato più lungo in alto deve equivalere alla linea median
      .attr("width", boxWidth)
      .attr("cursor", "pointer")
      .style("fill", "rgb(0, 0, 255,0)")
      .on("click", clickRect);  
  }

  // Aggiungi un titolo sopra il boxplot
  var titleFontSize = 15;

  svg.append("text")
    .attr("x", boxWidth)  // Posizione x al centro del grafico
    .attr("y", 10)  // Posizione y sopra il boxplot, regolabile in base alle tue esigenze
    .attr("text-anchor", "middle")  // Allinea il testo al centro
    .style("font-size", titleFontSize + "px")
    .text(title);
}


export { populateBoxplots };