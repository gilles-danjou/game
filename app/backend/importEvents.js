ds.Event.remove();

var event = new ds.Event();
event.ID		= 99;
event.pushNotifications = { list : [
	{
		type			: 'sms',
		from			: 6,
		content			: "Appelez moi dans 2 secondes si vous avez le temps de m'aider à régler une broutille.",
		scheduledTime	: 1000
	},
	{
		type			: 'reminder',
		content			: "Appelez Sherlock Holmes",
		scheduledTime	: 3000
	},
	{
		type			: 'reminder',
		content			: "Fin du rendez-vous avec Sherlock Holmes",
		scheduledTime	: 6000
	}

]};

event.actions = { list : [
	{
		'type'			: 'callOut',
		'to'			: 6,
		'scheduledTime'	: 3000,
		'duration'		: 3000,
		'response'		: {
			'notYet'	: 10000,
			'inTime'	: 2,
			'tooLate'	: 10001
		}				
	}
]};
				  
event.save();


var event = new ds.Event();
event.ID		= 2;
event.pushNotifications = { list : [
	{
		type			: 'sms',
		from			: 6,
		content			: "Bonjour Gilles",
		scheduledTime	: 0
	}
]};
event.save();


var event = new ds.Event();
event.ID		= 10000;
event.pushNotifications = { list : [
	{
		type			: 'sms',
		from			: 6,
		content			: "Je ne suis pas encore disponible. rappelez moi à l'heure convenue.",
		scheduledTime	: 2000
	}
]};
event.save();

var event = new ds.Event();
event.ID		= 10001;
event.pushNotifications = { list : [
	{
		type			: 'sms',
		from			: 6,
		content			: "Vous deviez m'appeler plus tôt. reéssayez dans 2 secondes.",
		scheduledTime	: 2000
	}
]};

event.actions = { list : [
	{
		'type'			: 'callOut',
		'to'			: 6,
		'scheduledTime'	: 5000,
		'duration'		: 10000,
		'response'		: {
			'notYet'	: 1000,
			'inTime'	: 2,
			'tooLate'	: 10001
		}				
	}
]};

event.save();