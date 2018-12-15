const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = function getProgress(request, response) {
	var id = request.query.id;

	
	getProgressFromDb(id, function(error, result) {
		
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			response.status(200).json(result);
		}
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