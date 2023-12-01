import * as categoryService from "./category.js"


export let scaleColor
export let firstSet = {}
firstSet = Observable(firstSet);
export let secondSet = {}
secondSet = Observable(secondSet);

export const customColors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
     "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
     "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5",
     "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173",
     "#00FFFF", "#FF00FF", "#FFFF00", "#00FF00", "#FF0000",  // Esempi di colori aggiuntivi
     "#FFD700", "#9400D3", "#8B008B"
];


function Observable(target) {
  let handlers = Symbol('handlers');
  // 1. Initialize handlers store
  target[handlers] = [];

  // Store the handler function in array for future calls
  target.observe = function(handler) {
    this[handlers].push(handler);
  };

  // 2. Create a proxy to handle changes
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let success = Reflect.set(...arguments); // forward the operation to object
      if (success) { // if there were no error while setting the property
        // call all handlers
        target[handlers].forEach(handler => handler(property, value));
      }
      return success;
    }
  });
}

export function distinctValuesPerKey(dataJson) {
    // Inizializza un oggetto vuoto per tenere traccia dei valori distinti per ogni chiave
    const distinctValues = {};

    // Itera sugli oggetti nell'array
    dataJson.forEach(obj => {
        // Itera attraverso le chiavi di ogni oggetto
        Object.keys(obj).forEach(key => {
            // Inizializza un array per la chiave se non esiste già
            if (!distinctValues[key]) {
                distinctValues[key] = [];
            }

            // Aggiungi il valore alla lista se non è già presente
            if (!distinctValues[key].includes(obj[key])) {
                distinctValues[key].push(obj[key]);
            }
        });
    });

    return distinctValues;
}

export function initializeScaleColor(jsonPCAData) {
  const distinctPCAData = distinctValuesPerKey(jsonPCAData)
  scaleColor = d3.scaleOrdinal().domain(distinctPCAData["Category"]).range(customColors);
}

export function getScaleColor(){
  return scaleColor
}

export function setFirstSet(newSet) {
  firstSet.value = newSet
}
export function setSecondSet(newSet){
  secondSet.value = newSet
}

export function isEmpty(data){
    if (data.value == undefined || data.value == [] || data.value.length == 0)
      return true
    else false
}
  
export function resetCheckBox(){
    categoryService.removeCheckBox()
    categoryService.createCheckBox(categoryService.distinctPCAData);
    categoryService.setNumberOfCheckBoxSelected(0);
}

export function disabledCheckBox() {
  
    let nodeListCheckbox = Array.from($("input:checkbox")).filter(checkbox => checkbox.classList.length == 0);
    for (let i = 0; i < nodeListCheckbox.length; i++) {
      nodeListCheckbox[i].disabled = true;
    }
  
}