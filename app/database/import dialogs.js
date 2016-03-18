ds.Dialog.remove();

var dialogFile = ds.getModelFolder().path + 'dialogs.csv';

var mystream = new TextStream(dialogFile,"Read",-2);
var row = "";

var event = new ds.Event();
event.ID = 2;
event.save();

timeline = 1000;

do { 
    row = mystream.read(''); 
    cells = row.split(";")
  
	var dialog = new ds.Dialog();
	dialog.event	= event;
	if (cells[0]) dialog.Context	= cells[0];
	
	for (i=1 ; i <= 22 ; i++) {
	
		if (cells[i]) {
			dialog.pnj		= ds.PNJ(i);
			dialog.subtitle	= cells[i];
			dialog.timeline = timeline;
  		}
	}
	
	dialog.save();
	timeline = timeline + 1000;

} while(mystream.end()==false)

mystream.close();