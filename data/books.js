const { Pool } = require("pg");

export default function getBooks(request, response) {
	getBooksFromDb(function (error, result) {
		if (error || result == null) {
			response.status(500).json({ success: false, data: error });
		}
		else {
			response.status(200).json(result);
		}
	});
}

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
		callback(null, result.rows);
	});

}