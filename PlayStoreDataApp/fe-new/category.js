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
    checkbox.name = dataCategory;
    checkbox.value = dataCategory;
    checkbox.style.accentColor = scaleColor(dataCategory);
    
    // Add the onchange event to each checkbox
    checkbox.addEventListener("change", function () {
      // Your onchange logic here
      console.log(`Checkbox for ${dataCategory} changed: ${checkbox.checked}`);
    });
    // checkbox.style.color = scaleColor(index); // Colore quando selezionato
    // insertStyleCheckBox(dataCategory,scaleColor(index))
    // checkbox.style.backgroundColor = "yellow"; // Colore quando non selezionato
    // Creazione dell'elemento label associato al checkbox
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
