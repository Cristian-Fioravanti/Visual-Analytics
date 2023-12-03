import { getAllCategory } from "./ajaxService.js";
import * as commonService from "./commonService.js";

let scaleColor;
export var numberOfCheckBoxSelected = 0;
export var firstCategory = null;
export var secondCategory = null;
export var selectedCategories = []
export let distinctPCAData = [];
let allData;

export function insertCategory(jsonPCAData) {
  allData = jsonPCAData
  scaleColor = commonService.getScaleColor();
  distinctPCAData = commonService.distinctValuesPerKey(jsonPCAData);
  createCheckBox(distinctPCAData);
}

export function createCheckBox(distinctPCAData) {
  removeCheckBox()
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
  var mode = commonService.mode.value
  if(mode=='Visualize') {  
    if (event.target.classList.length > 0) {
      event.target.classList.remove("checked");
      var category = event.target.id
      d3.selectAll("circle.selectedScatterPlot[name='" + category + "']").classed("selectedScatterPlot",false)
      var index = selectedCategories.indexOf(category);
      if (index !== -1) {
        selectedCategories.splice(index, 1);
      }
      var oldSet = commonService.firstSet.value
      if(oldSet==undefined || oldSet.length==0) {
        var newSet = []
      } else {
        var newSet = oldSet.filter(function(obj) {return obj.Category != event.target.id;});
      }
      commonService.setFirstSet(newSet)
    } else {
      event.target.classList.add("checked");
      var brush = d3.select(".brush")
      if(selectedCategories.length==0 && brush.empty()) {
        d3.selectAll("circle").classed("selectedScatterPlot",false)
        var firstCat = true
      } else {
        var firstCat = false
      }
      var category = event.target.id
      d3.selectAll("circle[name='" + category + "']").classed("selectedScatterPlot",true)
      selectedCategories.push(category);

      var oldSet = firstCat ? [] : commonService.firstSet.value
      var addingSet = allData.filter(function(obj) {return obj.Category == event.target.id;});
      if(oldSet==undefined || oldSet.length==0) {
        var mergedArray = addingSet
      } else {
        var unicAddingSet = addingSet.filter(obj2 => !oldSet.some(obj1 => obj1.ID === obj2.ID));
        // Unisci i due array senza duplicati
        var mergedArray = [...oldSet, ...unicAddingSet];
      }
      commonService.setFirstSet(mergedArray)
    }
  }
  else {
    if (numberOfCheckBoxSelected > 1) {
      removeCheckBox()
      createCheckBox(distinctPCAData);
      numberOfCheckBoxSelected = 0;
      firstCategory = null;
      secondCategory = null;
      commonService.setSecondSet([])
      commonService.setFirstSet([])
      d3.select("#scatterPlot").selectAll("circle").classed("selectedScatterPlot", false);
    } 
  
    if (event.target.classList.length > 0) {
      event.target.classList.remove("checked");
      if(firstCategory == event.target.id ) {
        d3.selectAll("circle.selectedScatterPlot[name='" + firstCategory + "']").classed("selectedScatterPlot",false)
        firstCategory=null;
        commonService.setFirstSet([])
      } else if (secondCategory == event.target.id) {
        d3.selectAll("circle.selectedScatterPlot[name='" + secondCategory + "']").classed("selectedScatterPlot",false)
        secondCategory =  null
        commonService.setSecondSet([])
      }    
      if (numberOfCheckBoxSelected>0) {
        numberOfCheckBoxSelected--;
        if(numberOfCheckBoxSelected==0) {
          let nodeListCheckbox= Array.from($("input:checkbox")).filter(checkbox=> checkbox.classList.length == 0);
          for (let i = 0; i < nodeListCheckbox.length; i++) {
            nodeListCheckbox[i].disabled = false;
          }
        }
      }
    } else {
      //deseleziona tutti i cerchi
      if (commonService.isEmpty(commonService.firstSet) && commonService.isEmpty(commonService.secondSet))
        d3.select("#scatterPlot").selectAll("circle").classed("selectedScatterPlot", false);
      
      event.target.classList.add("checked");
      // popola primo set, anche se secondo set è pieno
      if (commonService.isEmpty(commonService.firstSet)) {
        let selectedCategory = document.getElementsByName(event.target.id);
        firstCategory = event.target.id
        selectedCategory.forEach((circle) => circle.classList.add("selectedScatterPlot"));
        commonService.setFirstSet(Array.from(selectedCategory).map((circle) => circle.__data__));
      }
      //popola secondo set
      else if (commonService.isEmpty(commonService.secondSet)) {
        let selectedCategory = document.getElementsByName(event.target.id);
        secondCategory = event.target.id
        selectedCategory.forEach((circle) => circle.classList.add("selectedScatterPlot"));
        commonService.setSecondSet(Array.from(selectedCategory).map((obj) => obj.__data__));
        
      }
      // se c'è già una checkbox selezionata quindi questa è la seconda 
      // o se è la prima selezionata e il secondo set è già popolato, disabilito le checkbox
      if (numberOfCheckBoxSelected == 1 || !commonService.isEmpty(commonService.secondSet)) {
        let nodeListCheckbox= Array.from($("input:checkbox")).filter(checkbox=> checkbox.classList.length == 0);
        for (let i = 0; i < nodeListCheckbox.length; i++) {
          nodeListCheckbox[i].disabled = true;
        }
      }
      numberOfCheckBoxSelected++;
    }     
  } 
}

export function removeCheckBox() {
    let categoryElem = document.getElementById("category")
    while (categoryElem.firstChild) {
    categoryElem.removeChild(categoryElem.firstChild);
    }
}
  
export function setNumberOfCheckBoxSelected(number){
  numberOfCheckBoxSelected = number
}

export function resetCategory() {
  firstCategory = null
  secondCategory = null
  selectedCategories = []
}