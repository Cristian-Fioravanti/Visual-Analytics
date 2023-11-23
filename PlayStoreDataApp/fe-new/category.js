import { getAllCategory } from "./ajaxService.js";

const customColors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
     "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
     "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5",
     "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173",
     "#00FFFF", "#FF00FF", "#FFFF00", "#00FF00", "#FF0000",  // Esempi di colori aggiuntivi
     "#FFD700", "#9400D3", "#8B008B"
  ];
main();

function main() {
  insertCategory();
}

function insertCategory() {
  getAllCategory().done(function (jsonData) {
    jsonData = jsonData.sort(() => Math.random() - 0.5)
    let size = jsonData.length

    const scaleColor = d3.scaleOrdinal().domain([0,33]).range(customColors);
    let index = 0
    jsonData.forEach((dataCategory) => {
    
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = dataCategory.Category;
      checkbox.name = dataCategory.Category;
      checkbox.value = dataCategory.Category;
      checkbox.style.accentColor = scaleColor(index);
      // checkbox.style.color = scaleColor(index); // Colore quando selezionato
      // insertStyleCheckBox(dataCategory,scaleColor(index))
      // checkbox.style.backgroundColor = "yellow"; // Colore quando non selezionato
      // Creazione dell'elemento label associato al checkbox
      var label = document.createElement("label");
      label.htmlFor = dataCategory.Category;
      label.style.color = scaleColor(index)
      label.appendChild(document.createTextNode(dataCategory.Category));

      var br = document.createElement("br");
      
      let categoryElem = document.getElementById("category");
      categoryElem.appendChild(label);
      categoryElem.appendChild(checkbox);
      categoryElem.appendChild(br);
      index++
    });
    index= 0
  });
}