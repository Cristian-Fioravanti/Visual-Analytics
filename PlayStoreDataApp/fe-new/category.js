import { getAllCategory } from "./ajaxService.js";
import * as commonService from "./commonService.js";

let scaleColor;
let numberOfCheckBoxSelected = 0;
let distinctPCAData = [];
// main();

// function main() {
//   insertCategory();
// }

export function insertCategory(jsonPCAData) {
  scaleColor = commonService.getScaleColor();
  distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData);
  createCheckBox(distinctPCAData);
}

function createCheckBox(distinctPCAData) {
  distinctPCAData["Category"].forEach((dataCategory) => {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = dataCategory;
    // checkbox.name = dataCategory;
    checkbox.value = dataCategory;
    checkbox.style.accentColor = scaleColor(dataCategory);

    // Add the onchange event to each checkbox
    checkbox.addEventListener("change", function (event) {
      // Your onchange logic here
      selectCircles(event);
    });

    var label = document.createElement("label");
    label.htmlFor = dataCategory;
    label.style.color = scaleColor(dataCategory);
    label.appendChild(document.createTextNode(dataCategory));

    var br = document.createElement("br");

    let categoryElem = document.getElementById("category");
    categoryElem.appendChild(label);
    categoryElem.appendChild(checkbox);
    categoryElem.appendChild(br);
  });
}

function selectCircles(event) {
  
  if (numberOfCheckBoxSelected > 1) {
    removeCheckBox()
    createCheckBox(distinctPCAData);
    numberOfCheckBoxSelected = 0;
    commonService.setSecondSet([])
    commonService.setFirstSet([])
    d3.select("#scatterPlot").selectAll("circle").classed("selectedScatterPlot", false);
  } 
  
  if (event.target.classList.length > 0) {
    event.target.classList.remove("checked");
    if (numberOfCheckBoxSelected>0)
     numberOfCheckBoxSelected--;
  } else {
    //deseleziona tutti i cerchi
    if (commonService.isEmpty(commonService.firstSet) && commonService.isEmpty(commonService.secondSet))
      d3.select("#scatterPlot").selectAll("circle").classed("selectedScatterPlot", false);
    event.target.classList.add("checked");
    //popola primo set
    if (commonService.isEmpty(commonService.firstSet)) {
      let selectedCategory = document.getElementsByName(event.target.id);
      selectedCategory.forEach((circle) => circle.classList.add("selectedScatterPlot"));
      commonService.setFirstSet(Array.from(selectedCategory).map((circle) => circle.__data__));
    }
    //popola secondo set
    else if (commonService.isEmpty(commonService.secondSet)) {
      let selectedCategory = document.getElementsByName(event.target.id);
      selectedCategory.forEach((circle) => circle.classList.add("selectedScatterPlot"));
      commonService.setSecondSet(Array.from(selectedCategory).map((obj) => obj.__data__));
    }
     if (numberOfCheckBoxSelected == 1) {
    let nodeListCheckbox= Array.from($("input:checkbox")).filter(checkbox=> checkbox.classList.length == 0);
    for (let i = 0; i < nodeListCheckbox.length; i++) {
      nodeListCheckbox[i].disabled = true;
    }
  }
    numberOfCheckBoxSelected++;
  }
 
 
  


  function removeCheckBox() {
    let categoryElem = document.getElementById("category")
    while (categoryElem.firstChild) {
    categoryElem.removeChild(categoryElem.firstChild);
    }
    //  let nodeListCheckbox = $("input:checkbox");
    // for (let i = 0; i < nodeListCheckbox.length; i++) {
    //   nodeListCheckbox[i].remove();
    // }
    // let nodeListLabel = $("label");
    // for (let i = 0; i < nodeListLabel.length; i++) {
    //   nodeListLabel[i].remove();
    // }
    // let nodeListBr = $("br");
    // for (let i = 0; i < nodeListLabel.length; i++) {
    //   nodeListLabel[i].remove();
    // }
  }
}
