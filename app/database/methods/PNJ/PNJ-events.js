

model.PNJ.fullName.onGet = function() {
	return this.firstName + ' ' + this.lastName;
};


model.PNJ.picture.onGet = function() {
	return 'pnj' + this.ID + '.jpg'
};
