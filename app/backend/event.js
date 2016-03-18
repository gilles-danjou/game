
function event(request, response) {
try {

	var result;
 	
	if (typeof request === 'number') {
		eventID = request;
	} else {
		eventID = JSON.parse(request.body).ID;
	} 
 	var event = ds.Event(eventID);
	
	if (event) {
		
		if (event.scene) result = event.scene;
		
		var eventTime = Date.now();

		if (event.pushNotifications) {
			var notifications = event.pushNotifications.list;
			for (var i=0; i < notifications.length ; i++ ) {
				
				var pushNotification = new ds.PushNotification();
				
				pushNotification.type			= notifications[i].type ;
				pushNotification.from			= notifications[i].from ;
				pushNotification.content		= notifications[i].content ;
				pushNotification.scheduledTime	= eventTime + notifications[i].scheduledTime ;
				pushNotification.sent			= 'false';
				pushNotification.save();

			}
		}
		
		if (event.actions) {
			var actions = event.actions.list;
			for (var i=0; i < actions.length ; i++ ) {
				
				var action = new ds.Action();
				
				action.type			= actions[i].type ;
				action.beginTime	= eventTime + actions[i].scheduledTime ;
				action.endTime		= action.beginTime + actions[i].duration ;
				//action.completed	= false;
				
				switch (action.type) {
					
					case 'callOut':
						action.config = { 
							'to'			: actions[i].to,
							'response'		: actions[i].response
						}			
					break;
					
				}
				
				action.save();

			}
		}
	} else {
		result = 'NO EVENT ' + eventID;
	}
	
	return JSON.stringify(result);	
	
} catch(err) { 
console.log('event --> ' + err.message); }
}