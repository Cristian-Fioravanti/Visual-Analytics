import { getAllCategory } from "./ajaxService.js";
import * as commonService from "./commonService.js";

let scaleColor;

// main();

// function main() {
//   insertCategory();
// }

export function insertCategory(jsonPCAData) {
  scaleColor = commonService.getScaleColor();

  const distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData);
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
      selectCircles(event)
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

  function selectCircles(event) {
    if (event.target.classList.length > 0) {
        event.target.classList.remove('checked')
      }
    else {
      //deseleziona tutti i cerchi
        if (isEmpty(commonService.firstSet) && isEmpty(commonService.secondSet)) d3
    .select("#scatterPlot").selectAll("circle").classed("selectedScatterPlot", false);
      event.target.classList.add('checked')
      //popola primo set
        if (isEmpty(commonService.firstSet)) {
          let selectedCategory = document.getElementsByName(event.target.id)
          selectedCategory.forEach(circle=> circle.classList.add("selectedScatterPlot"))
          commonService.setFirstSet(Array.from(selectedCategory).map(circle => circle.__data__))
        }
      //popola secondo set
        else if (isEmpty(commonService.secondSet)) {
          let selectedCategory = document.getElementsByName(event.target.id)
          selectedCategory.forEach(circle=> circle.classList.add("selectedScatterPlot"))
          commonService.setSecondSet(Array.from(selectedCategory).map(obj => obj.__data__))
        }
      }
  }
}
export function isEmpty(data){
    if (data.value == undefined || data.value == [] || data.value.length == 0)
      return true
    else false
  }