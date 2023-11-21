class PlayStoreData{

  constructor(rating, review, size, install, price){
    this.rating=rating;
    this.review = review;
    this.size=size;
    this.install = install;
    this.price=price;

  }
  
  getJson(){
    return  {
      'rating': this.rating,
      'review': this.review,
      'size': this.size,
      'install': this.install,
      'price': this.price
    }    
  }
}

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


export {getAllData, getMaxInstalls, getMaxReview}