import { getAllCategory } from "./ajaxService.js";

let ListPlayStoreData = [];
main();

function main() {
  insertCategory();
}

function insertCategory() {
  getAllCategory().done(function (jsonData) {
    jsonData.forEach((dataCategory) => {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = dataCategory.Category;
      checkbox.name = dataCategory.Category;
      checkbox.value = dataCategory.Category;

      // Creazione dell'elemento label associato al checkbox
      var label = document.createElement("label");
      label.htmlFor = dataCategory.Category;
      label.appendChild(document.createTextNode(dataCategory.Category));

      var br = document.createElement("br");
      
      let categoryElem = document.getElementById("category");
      categoryElem.appendChild(label);
      categoryElem.appendChild(checkbox);
      categoryElem.appendChild(br);
    });
  });
}
