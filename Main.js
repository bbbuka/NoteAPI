var express = require('express');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

app.listen(8081);

app.get('/', function(req, res){
    res.send('hello world');
});

app.get('/addNote' ,function(req, res){
	var newNote =  {
        'name' : req.query.name,
        'body' : req.query.body
   	};

   	var insertDocument = function(db, callback) {
   		db.collection('notes').insertOne( newNote, 
   			function(err, result) {
		    	assert.equal(err, null);
		    	console.log("Inserted a user into the users collection.");
		    	callback();
	  		});
	};
	
	mongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		insertDocument(db, function() {
      		db.close();
  		});
	});
    getRequest(newNote,res);
});

app.get('/getNotes' ,function(req, res){
	var findRestaurants = function(db, callback) {
	   var cursor = db.collection('notes').find();
	   var jsonString= '[';
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         console.log(doc);
	         jsonString += (JSON.stringify(doc) + ',');
	      } else {
	      	 jsonString =  jsonString.substring(0, jsonString.length - 1);
	      	 jsonString += ']';
	         callback(jsonString);
	      }
	   })
	};
	
	mongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		findRestaurants(db, function(jsonString) {
      		db.close();
      		res.set('Content-Type', 'application/json');
    		res.json(jsonString);
  		});
	});
});

app.get('/deleteNote',function(req, res){
	
	var id = req.query.id;
	var removeNote = function(db, callback) {
		var deleteObject=  { "_id": ObjectId(id)};
	   	db.collection('notes').deleteOne(
	     deleteObject,
	      function(err, results) {
	         callback();
	         if(!err){
	         	console.log(err);
	         	console.log(deleteObject);
				res.set('Content-Type', 'application/json');
    			res.json("OK");
	         }
	      }
	    );
	};

	mongoClient.connect(url, function(err, db) {
	  	assert.equal(null, err);
	  	removeNote(db, function() {
	     db.close();
	  	});
	});
});



console.log('Server running at http://146.185.150.81:8081/');

function getRequest (note,resp) {
    resp.set('Content-Type', 'application/json');
    resp.json(note);
}