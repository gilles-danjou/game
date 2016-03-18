

function scenarios(request, response){
	var scenarios = ds.Scenario.all();
	return JSON.stringify(scenarios);	
}

function scenario(request, response){
try {
	include('backend/event.js');

	ds.PushNotification.remove();
	ds.Action.remove();
	
	var scenario = ds.Scenario(JSON.parse(request.body));
  	event(scenario.firstEvent, null);

	return 'Begin of scenario';
	
} catch(err) { console.log('scenario --> ' + err.message); }
}























