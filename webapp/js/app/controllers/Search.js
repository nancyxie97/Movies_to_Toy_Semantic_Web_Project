var basequery = "http://localhost:3030/MoviesToys?query=";
var formatquery = "&output=json";
var prefix =
  "PREFIX movies:<http://www.movieontology.org/2009/10/01/movieontology.owl#> " +
  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
  "PREFIX movie: <http://data.linkedmdb.org/resource/movie/> " +
  "PREFIX toys: <http://www.semanticweb.org/amazon_toy_products#> " +
  "PREFIX xds: <http://www.w3.org/2001/XMLSchema#> ";
var movieGraph = "<http://localhost:3030/MoviesToys/data/Movies>";
var toyGraph = "<http://localhost:3030/MoviesToys/data/Toys>";
 

function search(value)
{
	if(value === ""){
		var tbody = document.getElementById('tb');
		tbody.innerHTML = "";
		return;
	}
	
	var lowValue = value.toLowerCase();

	var searchMovieQuery =
		" SELECT ?movieName ?prodCompany ?budget ?revenue ?rating " +
		" FROM NAMED " + movieGraph +
        " WHERE {Graph ?g { ?subject movies:orginal_title ?movieName; movies:production_company ?prodCompany; " +
    		" movies:budget ?budget; movies:revenue ?revenue; movies:vote_avg ?rating.}"+
		" filter contains(lcase(str(?movieName)),\""+lowValue+"\").}"

	var searchMovieQuery = basequery + encodeURIComponent(prefix + searchMovieQuery) + formatquery;

	var searchMovie = new XMLHttpRequest();

	searchMovie.onreadystatechange = function() {
		if (searchMovie.readyState == XMLHttpRequest.DONE) {
			var table = document.getElementById('movieTable');
			var tbody = document.getElementById('tb');
			tbody.innerHTML = "";
			var res = JSON.parse(searchMovie.responseText);
			var nameArray = res.results.bindings;
			for(var x = 0; x < nameArray.length; x++){
				var row = tbody.insertRow(x);
				var cell = row.insertCell(0);
				cell.innerHTML = "<a>" + nameArray[x].movieName.value + "</a>"
				var cell = row.insertCell(1);
				cell.innerHTML = nameArray[x].prodCompany.value
				var cell = row.insertCell(2);
				cell.innerHTML = nameArray[x].budget.value
				var cell = row.insertCell(3);
				cell.innerHTML = nameArray[x].revenue.value
				var cell = row.insertCell(4);
				cell.innerHTML = nameArray[x].rating.value
				var cell = row.insertCell(5);
				cell.innerHTML = '<button type="button" onclick="(displayMovie(\''+nameArray[x].movieName.value+'\',\''+nameArray[x].prodCompany.value+'\'))">View Toys</button>'
			}
		}
	}
	searchMovie.open("GET", searchMovieQuery);
	searchMovie.send(null);
}

function displayMovie(title,prodCompany){
	var titleName = document.getElementById('movieName');
	titleName.innerHTML = title;
	var prodCompany1 = document.getElementById('productionComp');
	prodCompany1.innerHTML = prodCompany;
	var loading = document.getElementById('loading').style.display = "block";	
	var notLoading = document.getElementById('doneloading').style.display = "none";	
	var searchScreen = document.getElementById('search').style.display = "none";	
	var movieScreen = document.getElementById('movieInfo').style.display = "block";
	
	var lowTitle = title.toLowerCase();
	var lowprod = prodCompany.toLowerCase();
	
	var searchMovieToysQuery =
		"SELECT ?toyName ?toyDescription ?toyRate ?toyCost ?numOfReviews ?toyBrand "+
		" FROM NAMED " + movieGraph +
		" FROM NAMED " + toyGraph +
		" WHERE { " + 
		" Graph ?g { ?subject movies:orginal_title \"" + title + "\"; " +
		"			 movies:production_company \"" + prodCompany + "\". " +
		" {SELECT ?toyName ?toyDescription ?toyRate ?toyCost ?numOfReviews ?toyBrand WHERE{ " +
		"	 Graph ?g {?s toys:product_name ?toyName; toys:brand ?toyBrand; toys:description ?toyDescription; toys:num_of_reviews ?numOfReviews;" +
		" toys:avg_review_rating ?toyRate; toys:price ?toyCost.} }}}" +
		" filter ((contains(lcase(str(?toyName)), \"" + lowTitle + "\") || contains(lcase(str(?toyDescription)), \"" + lowTitle + "\")) && (contains(lcase(str(?toyName)), \"" + lowprod + "\") || contains(lcase(str(?toyDescription)), \"" + lowprod + "\"))) " +
		"}";

	
	
	var searchMovieToysQuery = basequery + encodeURIComponent(prefix + searchMovieToysQuery) + formatquery;
	
	var getMovieToys = new XMLHttpRequest();

	getMovieToys.onreadystatechange = function() {
		if (getMovieToys.readyState == XMLHttpRequest.DONE) {
			var tbody = document.getElementById('toytb');
			tbody.innerHTML = "";
			var res = JSON.parse(getMovieToys.responseText);
			var nameArray = res.results.bindings;
			document.getElementById("numoftoys").innerHTML = nameArray.length;
			for(var x = 0; x < nameArray.length; x++){
				var row = tbody.insertRow(x);
				var cell = row.insertCell(0);
				cell.innerHTML = nameArray[x].toyName.value
				var cell = row.insertCell(1);
				cell.innerHTML = nameArray[x].toyBrand.value
				var cell = row.insertCell(2);
				cell.innerHTML = nameArray[x].toyCost.value
				var cell = row.insertCell(3);
				cell.innerHTML = nameArray[x].toyDescription.value
				var cell = row.insertCell(4);
				cell.innerHTML = nameArray[x].numOfReviews.value
				var cell = row.insertCell(5);
				cell.innerHTML = nameArray[x].toyRate.value
			}
			var loading = document.getElementById('loading').style.display = "none";	
			var notLoading = document.getElementById('doneloading').style.display = "block";	
		}
	}
	getMovieToys.open("GET", searchMovieToysQuery);
	getMovieToys.send(null);
	
	
	
}

function displaySearch(){
	var searchScreen = document.getElementById('search').style.display = "block";	
	var movieScreen = document.getElementById('movieInfo').style.display = "none";
}