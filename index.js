const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000;
const { Pool } = require("pg"); 
const connectionString = process.env.DATABASE_URL;

const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.set('port', (process.env.PORT || 5000));

// Start the server running
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Establish a new connection to the data source specified the connection string.
const pool = new Pool({connectionString: connectionString});

// This says that we want the function "getPerson" below to handle
// any requests that come to the /getPerson endpoint
app.get('/book', function(request, response) {
	getBook(request, response);
});

app.get('/books', function(request, response) {
	getBooks(request, response);
});

app.post('/removeBook', function(request, response) {
	removeBook(request, response);
});

app.post('/addBook', function(request, response) {
	console.log('addBook');
	addBook(request, response);
});

app.get('/getUsers', function(request, response) {
	getUsers(request, response);
});



// This function handles requests to the /getPerson endpoint
// it expects to have an id on the query string, such as: http://localhost:5000/getPerson?id=1
function getBook(request, response) {
	// First get the person's id
	var id = request.query.id;

	// TODO: We should really check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getBookFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			response.status(200).json(result[0]);
		}
	});
}

function getBooks(request, response) {

	getBooksFromDb(function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}

function removeBook(request, response) {
	// First get the person's id
	console.log(request.body);
	var id = request.body.id

	console.log(id);
	removeBookFromDB(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json({success: true, data: 'Element removed'});
		}
	});
}

function addBook(request, response) {
	// First get the person's id
	console.log(request.body);
	var book = request.body.book

	console.log(book);
	addBookFromDB(book, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json({success: true, data: 'Element added'});
		}
	});
}

// This function handles requests to the /getPerson endpoint
// it expects to have an id on the query string, such as: http://localhost:5000/getPerson?id=1
function getUsers(request, response) {

	getUsersFromDb(function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			response.status(200).json(result);
		}
	});
}

// This function gets a person from the DB.
// By separating this out from the handler above, we can keep our model
// logic (this function) separate from our controller logic (the getPerson function)
function getBookFromDb(id, callback) {
	console.log("Getting person from DB with id: " + id);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = "SELECT a.id, a.Name, a.Author, a.ISBN, a.UserId, b.Name as user FROM books a INNER JOIN accounts b ON b.id = UserId WHERE a.id = $1::int";
	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	var params = [id];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));


		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

} // end of getPersonFromDb

function getBooksFromDb(callback) {
	console.log("Getting books from DB with id: ");
  
  const sql = "SELECT a.id, a.Name, a.Author, a.ISBN, a.UserId, b.Name as user FROM books a INNER JOIN accounts b ON b.id = UserId";

	pool.query(sql, null, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));


		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

}

function removeBookFromDB(id, callback) {
	console.log("Removing person from DB with id: " + id);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql1 = 'DELETE FROM lectureprogress WHERE BookId=$1::int';
	const sql = 'DELETE FROM books WHERE id=$1::int';
	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	var params = [id];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql1, params, function(err, result) {
		console.log('removingReference')
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		pool.query(sql, params, function(err, result) {
			// If an error occurred...
			console.log('removingProperBook')
			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}
	
	
			// When someone else called this function, they supplied the function
			// they wanted called when we were all done. Call that function now
			// and pass it the results.
	
			// (The first parameter is the error variable, so we will pass null.)
			callback(false, {});
		});
	});
	

}

function addBookFromDB(book, callback) {
	console.log("add book person from DB with id: " + book.name);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = 'INSERT INTO books(Name, Author, ISBN, Cover, UserId)  VALUES($1::int, $1::int, $2::int, :$3::int, $4::int)';

	const sql = 'DELETE FROM books WHERE id=$1::int';
	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	var params = [book.id, book.author, book.isbn, book.cover, book.owner];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		console.log('adding book')
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		callback(false, {});
	});
	

}
function getUsersFromDb(callback) {
	console.log("Getting users from DB with ");
  
  const sql = "SELECT Id, Name FROM Accounts"
	pool.query(sql, null, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));


		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

}