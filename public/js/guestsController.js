angular.module("addGuests").controller("GuestsController", GuestsController);

function GuestsController(){
	var self = this;

	this.guestList = [
      {name: "Miss Terry", email: 'mys.terry@gmail.com', rsvp:false},
		{name: "Mr E. Mann", email: 'mr.e.mann@gmail.com', rsvp:false},
	];

	self.addGuest = addGuest;
	self.deleteGuest = deleteGuest;
	self.completedGuests = completedGuests;
	self.remainingGuests = remainingGuests;

	//function that allows us to add new guests to our guestList
	function addGuest(){
		self.guestList.push({name: self.text, email: self.email, done: false});
		self.text = null;
	}

	//function that allows us to delete specific guests from our guestList
	function deleteGuest($index){
		self.guestList.splice($index, 1);
	}

	//returns a count of the tasks that have been marked as done
	function completedGuests(){
		return self.guestList.filter(function(x){ return x.done == true; })
	}

	//returns a count of the tasks that have not been marked as done
	function remainingGuests(){
		return self.guestList.filter(function(x){ return x.done == false; })
	}

}
