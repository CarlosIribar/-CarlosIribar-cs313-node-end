const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = function addBook(request, response) {
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