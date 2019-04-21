//the base info that is required for all the queries
var basequery = "http://localhost:3030/MoviesToys?query=";
var formatquery = "&output=json";
var prefix =
  "PREFIX movies:<http://www.movieontology.org/2009/10/01/movieontology.owl#>" +
  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
  "PREFIX movie: <http://data.linkedmdb.org/resource/movie/>" +
  "PREFIX toys: <http://www.semanticweb.org/amazon_toy_products#>" +
  "PREFIX xds: <http://www.w3.org/2001/XMLSchema#>";
var namedGraphs =
  "FROM NAMED <http://localhost:3030/MoviesToys/data/Movies>" +
  "FROM NAMED <http://localhost:3030/MoviesToys/data/Toys>";

var q1 = queryone(basequery, formatquery, prefix, namedGraphs);
//var temp = temp(basequery, formatquery, prefix);
var PageView = this;
PageView.currentView = ko.observable("ScenarioView");
PageView.Home = function() {
  PageView.currentView("ScenarioView");
};
PageView.About = function() {
  PageView.currentView("AboutView");
};
PageView.Search = function() {
  PageView.currentView("SearchView");
};

ko.applyBindings(PageView);

function temp(basequery, formatquery, prefix) {
  console.log("Temp");

  //var basequery = "http://localhost:3030/MoviesToys?query="
  //var formatquery = "&output=json"
  var querytxt_one =
    "SELECT ?genre (COUNT(?title) AS ?GenreNumber)" +
    "WHERE { GRAPH <http://localhost:3030/MoviesToys/data/Movies> {?s movies:genre ?genre;" +
    "movies:orginal_title ?title.}" +
    "}" +
    "group by ?genre";

  var complete_q1 =
    basequery + encodeURIComponent(prefix + querytxt_one) + formatquery;

  var queryone = new XMLHttpRequest();

  // Open a new connection, using the GET request on the URL endpoint
  queryone.open("GET", complete_q1);

  queryone.onload = function() {
    // Begin accessing JSON data here

    //querying cateogories
    var data = JSON.parse(this.response);

    data = data.results.bindings;

    if (queryone.status >= 200 && queryone.status < 400) {
      var arr = [];
      var title = ["Genre", "Genre Number"];
      arr.push(title);
      data.forEach(type => {
        //console.log(type.length);
        //console.log(type.genre.value)
        var ar = new Array(2);
        ar[0] = type.genre.value;
        ar[1] = parseInt(type.GenreNumber.value);
        arr.push(ar);
        /* $(document).ready(function(){
                        const h1 = document.createElement('h1');

                        h1.textContent = type.genre.value;
                        $("#root").append(h1);

                        }); */
      });
    } else {
      console.log("error");
    }
    //console.log(arr);

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawStuff);

    function drawStuff() {
      //console.log(arr);

      var data = google.visualization.arrayToDataTable(arr);

      var options = {
        title: "Genre per Movies",
        chartArea: { width: "100%", height: "100%" },
        hAxis: {
          title: "Genre"
        },
        vAxis: {
          title: "Number of Movies"
        }
      };

      var chart = new google.visualization.ColumnChart(
        document.getElementById("chart_div")
      );
      chart.draw(data, options);
    }
  };

  // Send queryone
  queryone.send();
}
function queryone(basequery, formatquery, prefix, namedGraphs) {
  // the only query needed for all our scenarios

  var query_1 =
    "SELECT ?title ?prodCompany ?budget ?revenue ?rating (count(?toyName) as ?toyCount) (avg(xds:float(?toyRate)) as ?avgToyRating) (avg(xds:float(?toyCoster)) as ?avgToyCost)" +
    namedGraphs +
    " WHERE {" +
    "Graph ?g { ?subject movies:orginal_title ?title;" +
    " movies:production_company ?prodCompany;" +
    " movies:budget ?budget;" +
    " movies:revenue ?revenue;" +
    " movies:vote_avg ?rating." +
    "{SELECT ?toyName ?toyDescription (SUBSTR(?toyRating,0,2) as ?toyRate) (SUBSTR(?toyCost,2) as ?toyCoster)" +
    " WHERE{" +
    "Graph ?g {?s toys:product_name ?toyName;" +
    " toys:description ?toyDescription;" +
    "toys:avg_review_rating ?toyRating;" +
    "toys:price ?toyCost.}" +
    "  }" +
    "}" +
    "}" +
    "filter ((contains(?toyName,?title) || contains(?toyDescription,?title)) && (contains(?toyName,?prodCompany) || contains(?toyDescription,?prodCompany)))" +
    "}" +
    "Group by ?title ?prodCompany ?budget ?revenue ?rating" +
    " ORDER BY DESC(?toyCount)";

  var complete_query =
    basequery + encodeURIComponent(prefix + query_1) + formatquery;

  console.log(complete_query);

  var d = new Date();
  var firstTime = d.getTime();

  var query_uno = new XMLHttpRequest();
  query_uno.open("GET", complete_query);
  query_uno.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  query_uno.setRequestHeader("Accept", "application/sparql-results+xml");

  var Toy_to_Movie_Rating = [];
  var Toy_to_Movie_Budget = [];
  var Toy_to_Movie_Revenue = [];
  var Toy_to_Movie_Count = [];
  var Movie_Rating_to_Avg_ToyRating = [];
  var Movie_Rating_to_Avg_ToyPrice = [];

  var maxPrice = 0;

  query_uno.onload = function() {
    var data = JSON.parse(this.response);
    //console.log(data);
    data = data.results.bindings;
    //console.log(data);
    //console.log(data[0].valueOf());

    if (query_uno.status >= 200 && query_uno.status < 400) {
      var title_Toy_to_Movie_Count = ["Movie Title", "Number of Toys"];
      Toy_to_Movie_Count.push(title_Toy_to_Movie_Count);

      Toy_to_Movie_Rating.push(["Movie Ratings", "Number of Toys"]);
      Toy_to_Movie_Rating = rating_arr(Toy_to_Movie_Rating);

      Movie_Rating_to_Avg_ToyRating.push([
        "Movie Ratings",
        "Average Toy Rating"
      ]);

      Movie_Rating_to_Avg_ToyPrice.push(["Movie Ratings", "Average Toy Price"]);

      Toy_to_Movie_Budget.push(
        ["Movie Budget", "Number of Toys"],
        ["Movie Budget < $1,000,000", 0],
        ["$1,000,000 <= Movie Budget < $10,000,000", 0],
        ["$10,000,000 <= Movie Budget < $50,000,000", 0],
        ["$50,000,000 <= Movie Budget < $100,000,000", 0],
        ["$100,000,000 <= Movie Budget < $200,000,000", 0],
        ["$200,000,000 <= Movie Budget", 0]
      );

      Toy_to_Movie_Revenue.push(
        ["Movie Budget", "Number of Toys"],
        ["Movie Budget < $1,000,000", 0],
        ["$1,000,000 <= Movie Revenue < $10,000,000", 0],
        ["$10,000,000 <= Movie Revenue < $50,000,000", 0],
        ["$50,000,000 <= Movie Revenue < $100,000,000", 0],
        ["$100,000,000 <= Movie Revenue < $200,000,000", 0],
        ["$200,000,000 <= Movie Revenue", 0]
      );
      data.forEach(type => {
        var inner_Toy_to_Movie_Count = [];

        inner_Toy_to_Movie_Count[0] = type.title.value;

        inner_Toy_to_Movie_Count[1] = parseInt(type.toyCount.value);

        Toy_to_Movie_Budget = ret_count_arr(
          Toy_to_Movie_Budget,
          parseInt(type.budget.value)
        );

        Toy_to_Movie_Revenue = ret_count_arr(
          Toy_to_Movie_Revenue,
          parseInt(type.revenue.value)
        );

        Toy_to_Movie_Rating = ret_ratings_arr(
          Toy_to_Movie_Rating,
          parseFloat(type.rating.value)
        );

        Movie_Rating_to_Avg_ToyRating.push([
          parseFloat(type.rating.value),
          parseFloat(type.avgToyRating.value)
        ]);

        Movie_Rating_to_Avg_ToyPrice.push([
          parseFloat(type.rating.value),
          parseFloat(type.avgToyCost.value)
        ]);
          
        if(maxPrice < parseFloat(type.avgToyCost.value)) {
            maxPrice = parseFloat(type.avgToyCost.value)
        }
        Toy_to_Movie_Count.push(inner_Toy_to_Movie_Count);
      });
    } else {
      console.log("error");
    }

    console.log("TESTING UGH");
    console.log(Movie_Rating_to_Avg_ToyRating);

    var ToyToMovieCountDraw = draw_Bar(
      Toy_to_Movie_Count,
      "Number of Toys per Movie",
      "Movies",
      "Number of Toys",
      "toy_movie_count"
    );

    var ToyToMovieRatingDraw = draw_Bar(
      Toy_to_Movie_Rating,
      "Number of Toys based on Movie Ratings",
      "Movie Ratings",
      "Number of Toys",
      "toy_movie_rating"
    );

    var MovieBudgetPie = draw_Pie(
      Toy_to_Movie_Budget,
      "Movie Budget to The Amount of Toys Created",
      "piechart_1"
    );

    var MovieRevenuePie = draw_Pie(
      Toy_to_Movie_Budget,
      "Movie Reven to The Amount of Toys Created",
      "piechart_2"
    );

    var MovieRatingtoAvgToyDraw = draw_Scatter(
      Movie_Rating_to_Avg_ToyRating,
      "Movie Ratings to Average Toy Rating",
      "Movie Ratings",
      "Average Toy Rating",
      5,
      "movie_rating_avg_toy"
    );

    var MovieRatingtoAvgToyPriceDraw = draw_Scatter(
      Movie_Rating_to_Avg_ToyPrice,
      "Movie Ratings to Average Toy Price",
      "Movie Ratings",
      "Average Toy Price",
      maxPrice,
      "movie_rating_avg_toy_price"
    );
  };

  query_uno.send();
}
function draw_Bar(arr, mainTitle, hTitle, vTitle, elementID) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawStuff);

  function drawStuff() {
    var data = google.visualization.arrayToDataTable(arr);

    var options = {
      title: mainTitle,
      chartArea: { width: "10000px ", height: "3000px" },
      hAxis: {
        title: hTitle
      },
      vAxis: {
        title: vTitle
      }
    };

    var chart = new google.visualization.ColumnChart(
      document.getElementById(elementID)
    );
    chart.draw(data, options);
  }
}
function draw_Pie(arr, mainTitle, elementID) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawPieChart);

  function drawPieChart() {
    var Pie_data = google.visualization.arrayToDataTable(arr);

    var Pie_options = {
      title: mainTitle
    };

    var chart = new google.visualization.PieChart(
      document.getElementById(elementID)
    );

    chart.draw(Pie_data, Pie_options);
  }
}
function draw_Scatter(arr, mainTitle, hTitle, vTitle, maxV, elementID) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawScatterChart);

  function drawScatterChart() {
    var data = google.visualization.arrayToDataTable(arr);

    var options = {
      title: mainTitle,
      hAxis: { title: hTitle, minValue: 0, maxValue: 5 },
      vAxis: { title: vTitle, minValue: 0, maxValue: maxV },
      legend: "none"
    };

    var chart = new google.visualization.ScatterChart(
      document.getElementById(elementID)
    );

    chart.draw(data, options);
  }
}
function ret_count_arr(count_arr, budget) {
  if (budget < 1000000) {
    count_arr[1][1]++;
  } else if (1000000 <= budget && budget < 10000000) {
    count_arr[2][1]++;
  } else if (10000000 <= budget && budget < 50000000) {
    count_arr[3][1]++;
  } else if (50000000 <= budget && budget < 100000000) {
    count_arr[4][1]++;
  } else if (100000000 <= budget && budget < 250000000) {
    count_arr[5][1]++;
  } else {
    count_arr[6][1]++;
  }

  return count_arr;
}
function rating_arr(ratin_arr) {
  for (var i = 1; i < 11; i++) {
    ratin_arr.push([i.toString(), 0]);
  }

  return ratin_arr;
}
function ret_ratings_arr(ratin_arr, rating) {
  if (1.0 <= rating && rating < 2.0) {
    ratin_arr[1][1]++;
  } else if (2.0 <= rating && rating < 3.0) {
    ratin_arr[2][1]++;
  } else if (3.0 <= rating && rating < 4.0) {
    ratin_arr[3][1]++;
  } else if (4.0 <= rating && rating < 5.0) {
    ratin_arr[4][1]++;
  } else if (5.0 <= rating && rating < 6.0) {
    ratin_arr[5][1]++;
  } else if (6.0 <= rating && rating < 7.0) {
    ratin_arr[6][1]++;
  } else if (7.0 <= rating && rating < 8.0) {
    ratin_arr[7][1]++;
  } else if (8.0 <= rating && rating < 9.0) {
    ratin_arr[8][1]++;
  } else if (9.0 <= rating && rating < 10.0) {
    ratin_arr[9][1]++;
  }

  return ratin_arr;
}
