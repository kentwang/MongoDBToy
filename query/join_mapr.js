var literature_map = function() {
	var key = this.MOVI;
	var value = {
		NOVL: this.NOVL,
	};

	emit(key, value);
}

var movie_map = function() {
	var key = this.Title;
	var value = {
		Rank: this.Rank
	};

	emit(key, value);
}

var reduceF = function(key, values) {
	var result = {
		NOVL: "",
		Rank: ""
	};

	values.forEach(function(value) {
		if(!!value.NOVL)
			result.NOVL = value.NOVL;

		if(!!value.Rank)
			result.Rank = value.Rank;

		// if(value.value.Rank !== null)
		// 	result.Rank = value.value.Rank;
	});

	return result;
}

res = db.shortliterature.mapReduce(
	literature_map,
	reduceF,
	{
		query: {
			NOVL: {
				$exists: 1
			}
		},
		out: 'mapr_movie_joined' // remove reduce. If not, reduce function is ran and Rank = null
	});

res = db.movies.mapReduce(
	movie_map,
	reduceF,
	{
		out: {
			reduce: 'mapr_movie_joined'
		}
	});

db.mapr_movie_joined.find({"value.NOVL": {$exists: true}}, {"value.Rank": 1, _id: 0})







