function pushNotification(request, response){

	var notif ='';
	ds.PushNotification.query('sent == false order by scheduledTime').forEach(function (pushNotification){

		if (pushNotification.scheduledTime < Date.now() && notif=='') {

			pushNotification.sent = 'true';
			pushNotification.save();
			notif = JSON.stringify(pushNotification);
			console.log(notif)
		}
	});
			

	return notif;
}

function resetNotifications(request, response){
	notifs = ds.PushNotification.all().forEach(function (pushNotification){
		pushNotification.sent = 'false';
		pushNotification.save();
	});
}


function deleteNotifications(request, response){
	ds.PushNotification.remove();
	ds.Action.remove();
	
}