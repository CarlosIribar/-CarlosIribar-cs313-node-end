const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = function addProgress(request, response) {
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