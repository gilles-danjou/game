
appControllers.controller('AppCtrl', ['$scope', '$http', '$mdSidenav', '$rootScope', function($scope, $http, $mdSidenav, $rootScope) {



var refresh = function() {
    $http.get(wakandaServerURL + 'scenarios').success(function(response) {
        $scope.scenarios = response;
  });
};

refresh();
$scope.notifications = [];
$rootScope.dialogs = [];
$scope.scene = '';
$scope.timer = 0;

$scope.startNotifications = function() {
	$scope.counter=0;
	setInterval(function(){  $scope.counter++; }, 1000);

	$scope.getPushNotification = setInterval(function(){
		$http.get(wakandaServerURL + 'pushNotification').success(function(response) {
	        console.log(response);
	        if (response) $scope.notifications.push(response);
	    });

	 }, 1000);
};


$scope.stopNotifications = function() {
	clearInterval($scope.getPushNotification);
};

$scope.resetNotifications = function() {
    $http.get(wakandaServerURL + 'resetNotifications').success(function(response) { console.log(response); });
};

$scope.deleteNotifications = function() {
    $http.get(wakandaServerURL + 'deleteNotifications').success(function(response) { console.log(response); });
};

$scope.getScenario = function(){
    var payload = this.scenario.ID;
    $http.post(wakandaServerURL + 'getScenario', payload).success(function(response) {
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

}

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


};

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





}]);
