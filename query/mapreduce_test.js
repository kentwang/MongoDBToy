db.products.insert({"product_id" : 1, "title" : "Sharpie"});
db.products.insert({"product_id" : 2, "title" : "Sticky"});
db.prices.insert({"product_id" : 1, "price" : 99});
db.prices.insert({"product_id" : 2, "price" : 30});

products_map = function() {
  emit(this.product_id, {"title" : this.title});
}

prices_map = function() {
  emit(this.product_id, {"price" : this.price});
}

r = function(key, values) {
  var result = {
      "title" : "",
      "price" : ""
    };

    values.forEach(function(value) {
      if(value.title !== null) {result.title = value.title;}

      if(value.price !== null) {result.price = value.price;}
    });

    return result;
}

res = db.prices.mapReduce(prices_map, r, 
{
	query: {
		price: {
			$lt: 50
		}
	},
	out: {
		replace : 'joined'
	}
});
res = db.products.mapReduce(products_map, r, {out: {replace : 'joined'}});
