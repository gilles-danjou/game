var myApp = angular.module('myApp',  ['ngMaterial']);
myApp.controller('AppCtrl', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav) {

var refresh = function() {
    $http.get('/scenarios').success(function(response) {
        $scope.scenarios = response;
  });
};

refresh();
$scope.notifications = [];
$scope.dialogs = [];
$scope.scene = '';
$scope.timer = 0;

$scope.startNotifications = function() {
	$scope.counter=0;
	setInterval(function(){  $scope.counter++; }, 1000);
	
	$scope.getPushNotification = setInterval(function(){ 
		$http.get('/pushNotification').success(function(response) {
	        console.log(response);
	        if (response) $scope.notifications.push(response);
	    });

	 }, 1000);
}


$scope.stopNotifications = function() {
	clearInterval($scope.getPushNotification);
}

$scope.resetNotifications = function() {
    $http.get('/resetNotifications').success(function(response) { console.log(response); });
}

$scope.deleteNotifications = function() {
    $http.get('/deleteNotifications').success(function(response) { console.log(response); });
}

$scope.getScenario = function(){
    var payload = this.scenario.ID
    $http.post('/getScenario', payload).success(function(response) {
    $scope.scene = ''; $scope.notifications = [];
    $scope.context = ''; $scope.pnjs =[]; 
	$scope.startNotifications();
        console.log(response); 
    });
    
    getScene({ sceneID : -1, 'goto' : this.scenario.firstScene} );
};

$scope.getScene = function() {
    var payload = JSON.stringify({
    	'sceneID'		: this.scene.ID, 
    	'choice' 		: (this.choice) ? this.choice.id : null,
    	'goto'			: (this.scene.goto) ? this.scene.goto : null
    });   	
    getScene(payload);    
};

function getScene(payload) {
    $http.post('scene', payload).success(function(response) {
        console.log(response);
        $scope.scene = response;
    });
    
};

function getEvent(eventID) {
	console.log('goto event : ' + eventID);
    var payload = JSON.stringify({
    	'ID'		: eventID
    });   	
    $http.post('event', payload).success(function(response) {
	    console.log(response);
		$scope.scene = response;

	});
}

$scope.answerQuestion = function() {
	
	switch (this.notification.question.nextStep) {
		case 'event':
			getEvent(this.answer.nextStepID);
		break;
		
		case 'question':
			askQuestion(this.answer.nextStepID);
		break;
		
		case 'dialog':
			setTimeout(dialog, $scope.dialogs[this.notification.index].timeline, $scope.dialogs[this.notification.index].pnj.__KEY, $scope.dialogs[this.notification.index].subtitle, this.answer.nextStepID);
		break;	
		
	}
	

}

function askQuestion(index){
	$scope.notifications.push({
		sender		: 'Suzie',
		from		: '22',
		content 	: $scope.dialogs[index].questions[0].question,
		question	: $scope.dialogs[index].questions[0],				
		answers		: $scope.dialogs[index].answers,
		index		: index,
		timeup		: true,
	});
	var notificationID = $scope.notifications.length-1;
	
	questionTimer = setInterval(function(notifications, notificationID){
		$scope.timer= $scope.timer + 20;
		if ($scope.timer > 100) {
			console.log('too late');
			clearInterval(questionTimer);
			$scope.timer = 0;

			var notification = $scope.notifications[notificationID];		
			var randomAnswer = notification.answers[ (Math.floor(Math.random() * notification.answers.length)) ];
			$scope.notifications[notificationID].answers = null;
			$scope.notifications[notificationID].timeUp = null;
			//$scope.profil.assurance  --;
			switch (notification.question.nextStep) {
				case 'event':
					getEvent(randomAnswer.nextStepID);
				break;
				
				case 'question':
					askQuestion(notification.nextStepID);
				break;
				
				case 'dialog':
					setTimeout(dialog, $scope.dialogs[notification.index].timeline, $scope.dialogs[notification.index].pnj.__KEY, $scope.dialogs[notification.index].subtitle, notification.nextStepID);
				break;	
			}
			
		}
	}, 1000, $scope.notifications, notificationID);
 
}

function dialog(pnjID, subtitle, index) {
	$scope.pnjs.forEach(function(pnj){
		pnj.subtitle = '';
		pnj.whiteframe =  'md-whiteframe-1dp';
	});
	$scope.context = $scope.dialogs[index].context;
	$scope.pnjs[pnjID].subtitle		= subtitle;
	$scope.pnjs[pnjID].whiteframe	= 'md-whiteframe-9dp';

	if ($scope.dialogs[index].questions.length>0) {
		askQuestion(index);
	} else {
		if ($scope.dialogs[index]) setTimeout(dialog, $scope.dialogs[index].timeline, $scope.dialogs[index].pnj.__KEY, $scope.dialogs[index].subtitle, $scope.dialogs[index].nextDialogID);
	}
}

$scope.call = function() {

    var payload = JSON.stringify({
    	'type'	: 'callOut',
    	'to' 	: 6
    });    
     
    $http.post('action', payload).success(function(response) {
        console.log(response);
        
        $scope.pnjs		= [];
        $scope.dialogs[0]	= response[0];
        for (var i=1 ; i<response.length ; i++){
        	$scope.dialogs[response[i].ID] = response[i];	
   		}
        
        if (response == 'messagerie') {
			$scope.pnjs[0] = { 'ID' : -1 , 'fullName' : 'Messagerie', 'subtitle' : '', 'whiteframe' : 'md-whiteframe-1dp' };
        	$scope.context = '';
   		} else {
	        $scope.pnjs = [];
	        
	        for (var i=0; i<response.length ; i++) {
				if ($scope.pnjs.indexOf(response[i].pnj.__KEY) == -1) {
					$scope.pnjs[response[i].pnj.__KEY] = { 'ID' : response[i].pnj.__KEY , 'fullName' : response[i].pnjName, 'subtitle' : '', 'whiteframe' : 'md-whiteframe-1dp' };
				}
	    	}

			setTimeout(dialog, response[0].timeline, response[0].pnj.__KEY, response[0].subtitle, 0);
    	}
    });
    	 	
}

}]);



































