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
   