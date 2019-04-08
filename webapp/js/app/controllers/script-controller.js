// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'http://localhost:3030/Movies?query=PREFIX+movies%3A+%3Chttp%3A%2F%2Flocalhost%3A3030%2FMovies%2Fdata%23root%2Frow%2F%3E%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0ASELECT+%3Ftag%0AWHERE+%7B+movies%3Agenres_name+rdf%3Avalue+%3Ftag+.%7D%0A%0A&output=json', true)


// Send request
request.send()