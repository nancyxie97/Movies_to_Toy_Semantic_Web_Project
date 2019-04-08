 /*google.charts.load('current', {packages: ['corechart']});
            google.charts.setOnLoadCallback(drawChart);*/
                    var request = new XMLHttpRequest()
                
                // Open a new connection, using the GET request on the URL endpoint
                request.open('GET', 'http://localhost:3030/MoviesToys?query=PREFIX+movies%3A+%3Chttp%3A%2F%2Fwww.movieontology.org%2F2009%2F10%2F01%2Fmovieontology.owl%23%3E%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+movie%3A+%3Chttp%3A%2F%2Fdata.linkedmdb.org%2Fresource%2Fmovie%2F%3E%0ASELECT+%3Fgenre+(COUNT(%3Ftitle)+AS+%3FGenreNumber)%0A%0AWHERE+%7B+GRAPH+%3Chttp%3A%2F%2Flocalhost%3A3030%2FMoviesToys%2Fdata%2FMovies%3E+%7B%3Fs+movies%3Agenre+%3Fgenre%3B%0A+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++movies%3Aorginal_title+%3Ftitle.+%7D%0A++++++++%7D%0Agroup+by+%3Fgenre%0A%0A%0A%0A%0A&output=json', true)
        
                request.onload = function() {
                  // Begin accessing JSON data here
                
                  //querying cateogories
                  var data = JSON.parse(this.response)
                  console.log(data);
                  data = data.results.bindings;
                  //console.log(data[0].valueOf()); 
                  
                  
                  
                  if (request.status >= 200 && request.status < 400) {
                      var arr = [];
                      var title = ['Genre', 'Genre Number']
                  arr.push(title);
                    data.forEach(type => {
                        //console.log(type.length);
                      console.log(type.genre.value)
                      var ar = new Array(2);
                      ar[0] = type.genre.value
                      ar[1] = parseInt(type.GenreNumber.value)
                      arr.push(ar)
                     /* $(document).ready(function(){
                        const h1 = document.createElement('h1');

                        h1.textContent = type.genre.value;
                        $("#root").append(h1);

                        }); */
                      
                    })
                  } else {
                    console.log('error')
                  } 
                  console.log(arr);
                 
                google.charts.load('current', {packages: ['corechart']});
                google.charts.setOnLoadCallback(drawStuff);

                function drawStuff() {
                    console.log(arr);

                var data = google.visualization.arrayToDataTable(arr);

                var options = {
                    title: 'Genre per Movies',
                    chartArea: {width: '50%'},
                    hAxis: {
                    title: 'Genre',
                    },
                    vAxis: {
                    title: 'Number of Movies'
                    }
                };

                var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
                chart.draw(data, options); } 
                 
                
                }
                
                // Send request
                request.send()