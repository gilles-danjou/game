

model.PushNotification.sender.onGet = function() {
 
	var sender = ds.PNJ.find('ID == ' + this.from);
	if (sender) {
		return sender.firstName + ' ' + sender.lastName;
	} else {
		
		return 'Rappel'
	}
};
