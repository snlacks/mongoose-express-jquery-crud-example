var defineAndAppend = function(obj){
	var item = document.createElement(obj.el);

	for(var i = 0; i < obj.classes.length; i++){
		$(item).addClass(obj.classes[i]);
	}

	var $item = $(item);


	$item
		.attr(obj.attrs)
		.text(obj.text);

	return item;
};

var deleteClick = function(){
	console.log('Clicked delete');
	var thisTicket = findParentListItem.call(this);
	thisTicket.css("color", "red");
	$.ajax({
		type: 'DELETE',
		url: '/tickets/' + thisTicket._id
	}).done( function(){
		$("#ticket-" + thisTicket._id).hide(200, function(){ 
			$(this).remove(); 
		});
	});
};

var ticketBuilder = function(){
	var ticketObj = {
    		el: 'li',
		classes: ["ticket_item"],
		attrs:{
			'id': 'ticket-' + this._id,
			'for': this._id
		}
	    },
	    deleteObj = {
    		el: 'a',
		classes: ["delete_item"],
		attrs:{
		},
		text: 'x',
	    },
	    descObj = {
    		el: 'div',
		classes: ["ticket_desc"],
		attrs: {
			'contenteditable': true
		},
		text: this.description
	    };

	var ticketItem = defineAndAppend(ticketObj);
	var deleteItem = defineAndAppend(deleteObj);
	$(deleteItem).on('click', deleteClick);
	var ticketDescription = defineAndAppend(descObj);
	$(ticketDescription).on('focus', saveCurrentTicket)
	$(ticketDescription).on('blur', changeTicket);
	ticketItem.appendChild(deleteItem);
	ticketItem.appendChild(ticketDescription);
	
	$(ticketList).append(ticketItem);
};

var repopulateTickets = function(){
	var tickets_list = $.get('/tickets', function(tickets){
		
		ticketList.html('');

		$(tickets).each(function(){
			// Create the list item
			ticketBuilder.call(this);
		});

		$('#tickets');

	});

	ticketData = tickets_list;
	
	return tickets;
};

var prepareNewTicket = function(event, callback){
	event.preventDefault();

	var form = {};
	form.description = descInput.val();
	
	sendNewTicket(form);

};
var sendNewTicket = function(form){
	$.post('/tickets', form, function(data, textStatus, jqXHR){
		if(textStatus !== 'success'){
			console.log('Post Response: ');
			console.log(data);
			console.log(textStatus);
			console.log(jqXHR);
		}
	}).done(function(data){
		ticketBuilder.call(data);
		ticket_form.find('input').val('');

	});
		
};

// On Ticket Description change
// Create a button when clicked, it saves it.
var changeTicket = function(){
	var thisTicket = findParentListItem.call(this);
	console.log(thisTicket._id, thisTicket.desc);
	$.ajax({
		url: '/tickets',
		type: 'PUT',
		data: { _id: thisTicket._id,
			description: thisTicket.desc
		}
	}).done(function(data){
		if(data.description !== currentTickeOldText){
			console.log()
		} else {
			$(this).addClass('.error');
			console.log(currentTickeOldText);
		}
		repopulateTickets();
	});
};

var findParentListItem = function(){
	// must be bound to this.
	parentLi = $(this).parents('li');
	parentLi._id = parentLi.attr('for');
	parentLi.desc = parentLi.find('.ticket_desc').text();

	return parentLi;
};

var saveCurrentTicket= function(){
	currentTickeOldText = $(this).text();
}
var currentTickeOldText;
var ticketData;
var ticket_form = $('#ticket_form');
var descInput = ticket_form.find('input[name="description"]');
var ticketList = $('#tickets');


window.onload = function(){
	repopulateTickets();
	ticket_form.submit(prepareNewTicket);
};

