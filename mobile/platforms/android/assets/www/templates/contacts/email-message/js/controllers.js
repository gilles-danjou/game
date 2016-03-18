// For sent email you have to install $cordovaSocialSharing by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove nl.x-services.plugins.socialsharing
// $ ionic plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
//
// Learn more about $cordovaSocialSharing :
// http://ngcordova.com/docs/plugins/socialSharing/
//
// For sent message you have to install $cordovaSMS by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove com.cordova.plugins.sms
// $ ionic plugin add https://github.com/cordova-sms/cordova-sms-plugin.git
//
// Learn more about $cordovaSMS :
// http://ngcordova.com/docs/plugins/sms/
//
//
// For using mobile calling you must go to yourProjectPath/config.xml
// and put this following code in the access area.
// <access origin="tel:*" launch-external="yes"/>
//
// Controller of contract us page.
appControllers.controller('contractUsCtrl', function ($scope, $rootScope, $cordovaSocialSharing, $cordovaSms, $http) {

    // This function is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.contractInfo is store contract us data
        $scope.contractInfo = {
            telephone: "099-999-9999",
            email: "ionicmaterialdesign@gmail.com"
        };
    };// End initialForm.

    // sentSms is for send message by calling $cordovaSms
    // Parameter :
    // phoneNumber = number of sending message
    $scope.sentSms = function (phoneNumber) {
        //config options to sent message
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default.
            android: {
                intent: 'INTENT' // send SMS with the native android SMS messaging.
                //intent: '' // send SMS without open any other app.
            }
        };
        // calling $cordovaSms to sent message
        $cordovaSms.send(phoneNumber, " ", options);
    }; // End sentSms.

    // sentEmail is for send email by calling $cordovaSocialSharing.
    // Parameter :
    // email = email of receiver
    $scope.sentEmail = function (email) {
        $cordovaSocialSharing.shareViaEmail("", "", email, "", "", "");
        // format of sent email by using $cordovaSocialSharing is :
        //$cordovaSocialSharing.shareViaEmail(message, subject, toArr, ccArr, bccArr,file)
        // toArr, ccArr and bccArr must be an array, file can be either null, string or array.
    }; // End sentEmail.

    // callTo is for using mobile calling.
    // Parameter :
    // number = number that going to call.
    $scope.callTo = function (number) {
        window.open("tel:" + number);
    }; // End callTo.

    $scope.call = function(sharedService) {

    //  sharedService.prepForBroadcast('msg');
      console.log('appel lancé');
        var payload = JSON.stringify({
        	'type'	: 'callOut',
        	'to' 	: 6
        });

        $http.post(wakandaServerURL + 'action', payload).success(function(response) {
            console.log(response);

            $rootScope.pnjs		= []; $rootScope.dialogs = [];
            $rootScope.dialogs[0]	= response[0];
            for (var i=1 ; i<response.length ; i++){
            	$rootScope.dialogs[response[i].ID] = response[i];
       		}

          if (response == 'messagerie') {
    			     $rootScope.pnjs[0] = { 'ID' : -1 , 'fullName' : 'Messagerie', 'subtitle' : '', 'whiteframe' : 'md-whiteframe-1dp' };
               $rootScope.context = '';
       		} else {
    	        $rootScope.pnjs = [];

    	      for (i=0; i<response.length ; i++) {
    				if ($rootScope.pnjs.indexOf(response[i].pnj.__KEY) == -1) {
    					$rootScope.pnjs[response[i].pnj.__KEY] = { 'ID' : response[i].pnj.__KEY , 'fullName' : response[i].pnjName, 'subtitle' : '', 'whiteframe' : 'md-whiteframe-1dp' };
    				}
    	    	}

    			setTimeout(dialog, response[0].timeline, response[0].pnj.__KEY, response[0].subtitle, 0);
        	}
        });

    };

    function dialog(pnjID, subtitle, index) {
    	$rootScope.pnjs.forEach(function(pnj){
    		pnj.subtitle = '';
    		pnj.whiteframe =  'md-whiteframe-1dp';
    	});
    	$rootScope.context = $rootScope.dialogs[index].context;
    	$rootScope.pnjs[pnjID].subtitle		= subtitle;
    	$rootScope.pnjs[pnjID].whiteframe	= 'md-whiteframe-9dp';

    	if ($rootScope.dialogs[index].questions.length>0) {
    		askQuestion(index);
    	} else {
    		if ($rootScope.dialogs[index]) setTimeout(dialog, $rootScope.dialogs[index].timeline, $rootScope.dialogs[index].pnj.__KEY, $rootScope.dialogs[index].subtitle, $rootScope.dialogs[index].nextDialogID);
    	}
    }

    $scope.initialForm();

});
