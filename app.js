
/**
 * author: Masud
 * Module dependencies.
 */

var express = require('express');
var cradle = require('cradle');

var app = module.exports = express.createServer();
var conn = new(cradle.Connection)();
var db = conn.database('test');

var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: "db_username",
  password: "db_password",
  database: "db_name"
});

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: "asdfghjkl" }));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.dynamicHelpers({ messages: require('express-messages') });

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
	app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res) {
	var flash = req.flash();
	res.render('index', {
		title: 'TODO APP',
		flashes: flash.error ? flash.error : null
	});
});

app.get('/items', function(req, res) {
	// con.connect();
	con.query('SELECT * FROM items', function(err, rows, fields) {
	  if(err) throw err;

	  console.log('Data received from Db:\n');
	  console.log(rows);	  
	  res.render('items', {
			title: 'TODO ITEMS',
			items: rows
		});
	});
	// con.end();	
});

app.get('/items/new', function(req, res) {

	var item = {name: '', description: ''};

	res.render('new-form', {
		title: 'NEW ITEM',
		item: item
	});
});	

app.post('/items/new', function(req, res) {

	var item = req.body;
	console.log();

	con.query('INSERT INTO items SET ?', item, function(err, res) {
		if (err) {
			console.log(err);
			req.flash('err', 'Unable to create new item', err.reason);
			res.redirect('/items/new');
			return;
		}    	

	  	console.log('Last insert ID:');
	  	req.flash('info', 'Successfully added!');
		res.redirect('/items');		
	});
});	

app.get('/edit/:id', function(req, res) {

	var id = parseInt(req.params.id);
	console.log(id);

	// con.connect();  
  	con.query('SELECT * FROM items Where ID = ?', [id], function (err, result) {
    	if (err) {
			console.log(err);
			req.flash('err', 'Item %s does not exist', req.params.id);
			res.redirect('/items');
			return;
		}    	

		console.log(result)

		res.render('edit-form', {
			title: 'EDIT ITEM ' + req.params.id,
			item: result[0]
		});
  	});
  	// con.end();	
});

app.post('/edit/:id', function(req, res) {

	var id = parseInt(req.params.id);
	var item = req.body;
	console.log(id, item);
 
  	con.query('SELECT * FROM items Where ID = ?', [id], function (err, result) {
    	if (err) {
			console.log(err);
			req.flash('err', 'Item %s does not exist', req.params.id);
			res.redirect('/items');
			return;
		}    	

		console.log(result)

		con.query('UPDATE items SET name= ?, description = ? Where ID = ?', [item.name, item.description, id], function (err, result) {
			if (err) {
				console.log(err);
				req.flash('error', 'Database error: %s', err.reason);
				res.redirect('/edit/' + req.params.id);
				return;
			}

			console.log('Changed ' + result.changedRows + ' rows');
			req.flash('info', 'Successfully saved');
			res.redirect('/items');
		});
  	});  	
});

app.get('/items/:id', function(req, res, next) {

	var id = parseInt(req.params.id);	
	console.log(id);

	con.query('SELECT * FROM items Where ID = ?', [id], function (err, result) {
    	if (err) {
			console.log(err);
			req.flash('err', 'Item %s does not exist', req.params.id);
			res.redirect('/items');
			return;
		}    	

		console.log(result)

		con.query('DELETE FROM items WHERE id = ?', [id], function (err, result) {
	    	if (err) {			
				req.flash('error', 'Database error: %s', err.reason);
				res.redirect('/items');
				return;
			}

	    	console.log('Deleted ' + result.affectedRows + ' rows');
	  	});
  	});  	
	
	req.flash('info', 'Successfully Deleted!');
	res.redirect('/items');

  	// next(new Error('not implemented'));
});

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// vim:ts=4

