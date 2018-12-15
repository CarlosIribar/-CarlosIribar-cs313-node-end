const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const { Pool } = require("pg"); 
const getBooks = require("./data/books");


const PORT = process.env.PORT || 5000;
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

/* Endpoints */
app.get('/book', function(request, response) {
	getBook(request, response);
});

app.get('/progress', function(request, response) {
	getProgress(request, response);
});

app.get('/books', function(request, response) {
	getBooks(request, response);
});

app.post('/removeBook', function(request, response) {
	removeBook(request, response);
});

app.post('/addBook', function(request, response) {
	addBook(request, response);
});

app.get('/getUsers', function(request, response) {
	getUsers(request, response);
});

app.post('/editBook', function(request, response) {
	editBook(request, response);
});

app.post('/addProgress', function(request, response) {
	addProgress(request, response);
});


// Handlers 

function getProgress(request, response) {
	var id = request.query.id;

	
	getProgressFromDb(id, function(error, result) {
		
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}

function getBook(request, response) {
    var id = request.query.id;
    
	getBookFromDb(id, function(error, result) {
		
		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			response.status(200).json(result[0]);
		}
	});
}

/*function getBooks(request, response) {

	getBooksFromDb(function(error, result) {
		if (error || result == null ) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
	});
}*/

function removeBook(request, response) {
	console.log(request.body);
	var id = request.body.id

	console.log(id);
	removeBookFromDB(id, function(error, result) {
		
		if (error) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json({success: true, data: 'Element removed'});
		}
	});
}

function addBook(request, response) {
	console.log(request.body);
	var book = request.body.book

	addBookFromDB(book, function(error, result) {
		
		if (error) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json({success: true, data: 'Element added'});
		}
	});
}

function editBook(request, response) {
	console.log(request.body);
	var book = request.body.book

	console.log(book);
	editBookFromDB(book, function(error, result) {
		
		if (error) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json({success: true, data: 'Element added'});
		}
	});
}

function addProgress(request, response) {
	console.log(request.body);
	var progress = request.body.progress

	console.log(progress);
	addProgressFromDB(progress, function(error, result) {
		
		if (error) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json({success: true, data: 'Element added'});
		}
	});
}

function getUsers(request, response) {

	getUsersFromDb(function(error, result) {
		
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			response.status(200).json(result);
		}
	});
}
function getBookFromDb(id, callback) {
	
	const sql = "SELECT a.id, a.Name, a.Author, a.ISBN, a.UserId, b.Name as user FROM books a INNER JOIN accounts b ON b.id = UserId WHERE a.id = $1::int";
	
	const params = [id];

	
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}

function getProgressFromDb(id, callback) {
	console.log("Getting progress from DB with id: " + id);

	const sql = "SELECT b.StartDate, b.EndDate, b.Id, a.Name as user FROM LectureProgress b LEFT JOIN Accounts a ON UserId = a.Id WHERE b.BookId = $1::int";	
	const params = [id];

	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});

}

// function getBooksFromDb(callback) {
//     console.log("Getting books from DB with id: ");
  
//     const sql = "SELECT a.id, a.Name, a.Author, a.ISBN, a.UserId, b.Name as user FROM books a INNER JOIN accounts b ON b.id = UserId";

// 	pool.query(sql, null, function(err, result) {
// 		// If an error occurred...
// 		if (err) {
// 			console.log("Error in query: ")
// 			console.log(err);
// 			callback(err, null);
// 		}

// 		// Log this to the console for debugging purposes.
// 		console.log("Found result: " + JSON.stringify(result.rows));
// 		callback(null, result.rows);
// 	});

// }

function removeBookFromDB(id, callback) {
	console.log("Removing person from DB with id: " + id);

	const sql1 = 'DELETE FROM lectureprogress WHERE BookId=$1::int';
	const sql = 'DELETE FROM books WHERE id=$1::int';
	var params = [id];

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

			callback(false, {});
		});
	});
	

}

function addBookFromDB(book, callback) {
	console.log("add book person from DB with id: " + book.name);

	const sql = 'INSERT INTO books(Name, Author, ISBN, Cover, UserId) VALUES($1, $2, $3, $4, $5)';
	
	var params = [book.name, book.author, book.isbn, book.cover, book.owner];

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

function editBookFromDB(book, callback) {
	console.log("edit book person from DB with id: " + book.name);

	const sql = 'UPDATE books set Name=$1, Author=$2, isbn=$3, Cover=$4, userId=$5 WHERE id = $6 ';

	var params = [book.name, book.author, book.isbn, book.cover, book.owner, book.id];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		console.log('editing book')
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		callback(false, {});
	});
	

}

function addProgressFromDB(progress, callback) {
	console.log("add Progress from DB");

	const sql = 'INSERT INTO LectureProgress(StartDate, EndDate, UserId, BookId) VALUES ($1, $2, $3, $4)';
	if (progress.start == '') {
		progress.start == null;
	}

	if (progress.end == '') {
		progress.end == null;
	}

	var params = [progress.start, progress.end, progress.user, progress.bookId];

	
	pool.query(sql, params, function(err, result) {
		console.log('adding progress')
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
		callback(null, result.rows);
	});

}