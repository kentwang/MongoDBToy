//##1. List the number of votes and rank for the movie “The Matrix (1999)”.

db.movies.find({Title:"The Matrix (1999)"}, {Votes:1, Distribution:1, _id:0})

//##2. List the titles (only) of all movies with a rank of less than 8.3 and with at least 400,000 votes, print the titles in alphabetical order.

db.movies.find({Rank: {$lt: 8.3}, Votes: {$gte: 400000}}, {_id: 0, Title: 1}).sort({Title : 1})

//##3. Give the count of movies that have a rating of 8.9.

db.movies.find({Rank : 8.9}).count()

//##4. List all fields except _id for all movies that are NOT based on books (BOOK).

db.shortliterature.find( { BOOK: { $exists: false}}, {_id: 0} )

//##5. Do the same query as 4. except print using printjson().

db.shortliterature.find( { BOOK: { $exists: false}}, {_id: 0} ).forEach(printjson)

//##6. For movies with ADPTs, list the author and title of the ADPTs in the literature collection.  Print with pretty(). 

db.shortliterature.find( {"ADPT.Author": {$exists: true}}, {"ADPT.Author": 1, "ADPT.Title": 1, _id: 0}).pretty()

//##7. List the ranking of the movies that are based on a novel (NOVL) (DENORMALIZATION)

// pull out data from dbs movie and shortliterature
var movieTest = db.movies.find({}, {_id: 0}).sort({Title: 1}).toArray()
var shortLiteratureTest = db.shortliterature.find({}, {_id: 0}).sort({MOVI: 1}).toArray()

// join the collections on Title and MOVI. Not efficient
// Todo: sort join
for (i = 0; i < movieTest.length; i++) {
	var movie = movieTest[i];
	for (j = 0; j < shortLiteratureTest.length; j++) {
		var liter = shortLiteratureTest[j];
		if (movie.Title == liter.MOVI) {
			if (!!liter.ADPT)
				movie.ADPT = liter.ADPT;
			if (!!liter.BOOK)
				movie.BOOK = liter.BOOK;
			if (!!liter.NOVL)
				movie.NOVL = liter.NOVL;
			continue;
		}
	}
	// printjson(movie);
	db.movie_liter.insert(movie);
}

// list ranking of movies based on novel
db.movie_liter.find( {NOVL: {$exists: true}}, {Rank: 1, _id: 0})

//##8.  Specify the name of the movies that are based on more than one source (e.g. NOVL, BOOK, ADPT).
db.movie_liter.find( {$or: [
	{$and: [
		{NOVL: {$exists: true}},
		{BOOK: {$exists: true}}]
	}, 
	{$and: [
		{NOVL: {$exists: true}},
		{ADPT: {$exists: true}}]
	}, 
	{$and: [
		{NOVL: {$exists: true}},
		{ADPT: {$exists: true}}]
	}
	]}, 
	{Title: 1, _id: 0} ).pretty()

//##9.  Find the maximum number of votes, then divide each vote by the maximum number of votes.  Print the resulting values for each vote.
var maxVote = db.movie_liter.find({}, {Votes: 1, _id: 0}).sort({Votes: -1}).limit(1).toArray()[0].Votes
db.movie_liter.aggregate( {
	$project: {
		_id: 0,
		"Voting Rate": {
			$divide: ["$Votes", maxVote]
		}
	}
}).result

//## Extra credit. Use MapReduce paradigm of MongoDB for joining tables. No denomalization. 
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



