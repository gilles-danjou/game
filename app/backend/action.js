
//function getTIMESTAMP(date) {
////      var date = new Date();
//      var year = date.getFullYear();
//      var month = ("0"+(date.getMonth()+1)).substr(-2);
//      var day = ("0"+date.getDate()).substr(-2);
//      var hour = ("0"+date.getHours()).substr(-2);
//      var minutes = ("0"+date.getMinutes()).substr(-2);
//      var seconds = ("0"+date.getSeconds()).substr(-2);

//      return year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
//    }

function action(request, response) {

try {
	
	var payload = JSON.parse(request.body);
	var now = Date.now();
	var result = 'messagerie';
	var actions, action;
 
	switch (payload.type) {
		case 'callOut':
			actions = ds.Action.query('type == ' + payload.type + ' and completed == null and config.to ==' + payload.to);
		break;
	} 

	if (actions) action = actions.first();
	finded = false;

	while (!finded  && action != null)
	{
		
		switch (payload.type) {
			case 'callOut':		
 				//console.log(' | '  + (action.beginTime <= now) + ' | ' + (now) + ' | ' + (now <= action.endTime));

				if (action.beginTime <= now && now <= action.endTime) {			
					action.completed = true;
					action.save();
					result = createEvent(action.config.response.inTime, 'IN TIME');
					finded = true;
					
				} else if (now < action.beginTime) {
					result = createEvent(action.config.response.notYet, 'NOT YET READY');
					
				} else if (action.endTime < now) {
					result = createEvent(action.config.response.tooLate, 'TOO LATE');
					action.completed = false;
					action.save();					
				}
			break;
		}
		
		action=action.next();
	}
	
	 
	return result;
	
} catch(err) { console.log('action --> ' + err.message); }
}

function createEvent(enventID, log) {
try {

	var event = ds.Event(enventID);

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
	
	if (event.dialogs.length) { 
	
		dialogs = event.dialogs
		dialogsArray = dialogs.toArray();

		expandedDialogs = [];
		for (var i=0 ; i<dialogs.length ; i++) {
			expandedDialogs[i] = dialogsArray[i]

			if(dialogs[i].questions){
				var questions = dialogs[i].questions;
				expandedDialogs[i].questions =  questions.toArray();
		 
				var answers = questions.answers;
				expandedDialogs[i].answers =  answers.toArray();
			}
		}
	
		return JSON.stringify(expandedDialogs);
		
	} else {
		return 'messagerie';
	}

} catch(err) { console.log('createEvent ' + enventID + 	'--> ' + err.message); }
}