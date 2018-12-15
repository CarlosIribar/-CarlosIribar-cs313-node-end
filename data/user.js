const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = function getUsers(request, response) {

	getUsersFromDb(function(error, result) {
		
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			response.status(200).json(result);
		}
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