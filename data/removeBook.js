const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = function removeBook(request, response) {
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