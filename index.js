const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const getBooks = require("./data/books");
const getBook = require("./data/book");
const getUsers = require("./data/user");
const getProgress = require("./data/progress");
const editBook = require("./data/editBook");
const addBook = require("./data/addBook");
const removeBook = require("./data/removeBook");
const addProgress = require("./data/addProgress");


const PORT = process.env.PORT || 5000;

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
