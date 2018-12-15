const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = function editBook(request, response) {
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