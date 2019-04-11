//the base info that is required for all the queries
var basequery = "http://localhost:3030/MoviesToys?query=";
var formatquery = "&output=json";
var prefix =
  "PREFIX movies:<http://www.movieontology.org/2009/10/01/movieontology.owl#>" +
  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
  "PREFIX movie: <http://data.linkedmdb.org/resource/movie/>" +
  "PREFIX toys: <http://www.semanticweb.org/amazon_toy_products#>";
var namedGraphs =
  "FROM NAMED <http://localhost:3030/MoviesToys/data/Movies>" +
  "FROM NAMED <http://localhost:3030/MoviesToys/data/Toys>";

var temp = temp(basequery, formatquery, prefix);
var q1 = queryone(basequery, formatquery, prefix, namedGraphs);



function temp(basequery, formatquery, prefix) {
    console.log("Temp");
  //console.log(hello);
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
  //console.log("Hello There Nancy is testing ");
  //console.log(complete_q1);
  var queryone = new XMLHttpRequest();

  // Open a new connection, using the GET request on the URL endpoint
  queryone.open("GET", complete_q1, false);

  queryone.onload = function() {
    // Begin accessing JSON data here

    //querying cateogories
    var data = JSON.parse(this.response);
    //console.log(data);
    data = data.results.bindings;
    //console.log(data[0].valueOf());

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
        chartArea: { width: "100%" , height: "100%"},
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
    var length_category = 0;
  console.log("Query One");
    //title
  var final_arr = [];
  var title = ["Company", "Number of Toys Based on Production Company"];
    final_arr.push(title);

    
// finding toys based on descriptions that have the keyword of the production companies 
    
// only looking at 3 genres: adventure, family, animation (this is because the dataset is too large)
   
  var str_q1_1 =
    "SELECT   ?company (count(?toy_descript) as ?NumToy)" +
    namedGraphs +
    " WHERE { {GRAPH ?g {?idName toys:product_description ?toy_descript;" +
    "toys:product_name ?toy." +
    "{SELECT DISTINCT ?company" +
    " WHERE {GRAPH ?g{{?s movies:production_company ?company;" +
    "movies:orginal_title ?title;" +
    'movies:genre "Animation".}' +
    "UNION" +
    "{?s movies:production_company ?company;" +
    "movies:orginal_title ?title;" +
    'movies:genre "Family".} ' +
    "UNION" +
    "{?s movies:production_company ?company;" +
    "movies:orginal_title ?title;" +
    'movies:genre "Adventure".}}}' +
    "Limit 100000" +
    "}" +
    "filter contains(?toy_descript,?company)}}} group by ?company ORDER BY DESC(?NumToy)";
    
      var str_q1_2 =
    "SELECT   ?company (count(?toy) as ?NumToy)" +
    namedGraphs +
    " WHERE { {GRAPH ?g {?idName toys:product_description ?toy_descript;" +
    "toys:product_name ?toy." +
    "{SELECT DISTINCT ?company" +
    " WHERE {GRAPH ?g{{?s movies:production_company ?company;" +
    "movies:orginal_title ?title;" +
    'movies:genre "Animation".}' +
    "UNION" +
    "{?s movies:production_company ?company;" +
    "movies:orginal_title ?title;" +
    'movies:genre "Family".} ' +
    "UNION" +
    "{?s movies:production_company ?company;" +
    "movies:orginal_title ?title;" +
    'movies:genre "Adventure".}}}' +
    "Limit 100000" +
    "}" +
    "filter contains(?toy,?company)}}} group by ?company ORDER BY DESC(?NumToy)";

  var complete_q1 =
    basequery + encodeURIComponent(prefix + str_q1_1) + formatquery;
    var complete_q2 =
    basequery + encodeURIComponent(prefix + str_q1_2) + formatquery;
  console.log(complete_q2);

  var q1_1 = new XMLHttpRequest();
  q1_1.open("GET", complete_q1);
  q1_1.setRequestHeader ('Content-type', 'application/x-www-form-urlencoded');
    q1_1.setRequestHeader ("Accept", "application/sparql-results+xml");
  q1_1.onload = function() {
    
   var data = JSON.parse(this.response);
    //console.log(data);
    data = data.results.bindings;
      //console.log(data);
    //console.log(data[0].valueOf());

    if (q1_1.status >= 200 && q1_1.status < 400) {
      
      data.forEach(type => {
        //console.log(final_arr)
        //console.log(type.length);
        //console.log(type.genre.value)
        var ar = new Array(2);
        ar[0] = type.company.value;
        ar[1] = parseInt(type.NumToy.value);
        final_arr.push(ar);
          
      });
        //console.log(final_arr);
        
    } else {
      console.log("error");
    }
    
      return final_arr;
      
  };
   // final_arr = q1_1.onload;
   console.log(final_arr);

  q1_1.send();
    
    
    
    
   console.log(final_arr);
    
    
  
    
    
    
    
}
function findarray(arr,length_category){
    var tmp_arr = [];
    console.log("Inside find")
    console.log(arr[0])
    console.log(arr.length);
    for( i= 0; i < arr.length; i++){
        
    }
    
}
