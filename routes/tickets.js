var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

var ticketSchema = new mongoose.Schema({
	description: { type: String, required: true }
});
var Ticket = mongoose.model('Ticket', ticketSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
		Ticket.find(function(err, tickets){
		if(err) return console.error(err);
		res.send(tickets);
	});
});
 
router.post('/', function(req, res, next) {
	// console.log('Post: ');
	// console.log(req.body);
	var newIicket = new Ticket({
		description: req.body.description
	});
	console.log(req.body.description);

	newIicket.save(function(err){
		if(!err){
			return console.log("Created!");
		} else {
			return console.log(err);
		}
	});

	return res.send(newIicket);
});


router.put('/', function(req, res, next){
	return Ticket.findById(req.body._id, function(err, ticket){
		console.log(req.body.desc);
		ticket.description = req.body.description;
		return ticket.save(function(err){
			if(!err){
				console.log('updated');
			} else {
				console.log(err);
			}
			return res.send(ticket);
		});
	});
});

router.delete('/:id', function(req, res, next){

	var deleteFromDatabase = function(err, ticket){
		return ticket.remove(function(err){
			if(!err){
				console.log("Removed: " + req.params.id);
				return res.send('');
			} else {
				console.log(err);
			}
		});
	};
	

	return Ticket.findById(req.params.id, function(err, ticket){
		if (!err && ticket) return deleteFromDatabase(err, ticket);
		return;
	});
});

module.exports = router;
 