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


function getBookFromDb(id, callback) {
	console.log("Getting person from DB with id: " + id);

	
	var sql = "SELECT a.id, a.Name, a.Author, a.ISBN, a.UserId, b.Name as user FROM books a INNER JOIN accounts b ON b.id = UserId WHERE a.id = $1::int";
	
	var params = [id];

	
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

module.exports = getBook;