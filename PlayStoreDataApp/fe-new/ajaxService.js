function getAllData(){
  return $.ajax({
    url: 'http://localhost:8099/star',
    method: 'GET',
    dataType: 'json'
  });
}

function getMaxReview(){
  return $.ajax({
    url: 'http://localhost:8099/maxReview',
    method: 'GET'
  });
}

function getMaxInstalls(){
  return $.ajax({
    url: 'http://localhost:8099/maxInstalls',
    method: 'GET'
  });
}
function getAllCategory(){
  return $.ajax({
    url: 'http://localhost:8099/category',
    method: 'GET',
    dataType: 'json'
  });
}
function getAllDataPCA(){
  return $.ajax({
    url: 'http://localhost:8099/all-data-pca',
    method: 'GET',
    dataType: 'json'
  });
}
export {getAllData, getMaxInstalls, getMaxReview, getAllCategory, getAllDataPCA}