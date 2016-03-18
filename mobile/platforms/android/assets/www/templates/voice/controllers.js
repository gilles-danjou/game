// Controller of menu dashboard page.
appControllers.controller('speechRecognitionCtrl', function ($scope) {
  $scope.data = {
    speechText: ''
  };
  $scope.recognizedText = '';

  $scope.speakText = function() {
    TTS.speak({
           text: $scope.data.speechText,
           locale: 'en-GB',
           rate: 1.5
       }, function () {
           // Do Something after success
       }, function (reason) {
           // Handle the error case
       });
  };

  $scope.record = function() {

    var permissions = window.plugins.permissions;
    permissions.hasPermission(checkPermissionCallback, null, permissions.RECORD_AUDIO);

    function checkPermissionCallback(status) {
      if(!status.hasPermission) {
        var errorCallback = function() {
          console.warn('Camera permission is not turned on');
        }

        permissions.requestPermission(function(status) {
          if( !status.hasPermission ) errorCallback();
        }, errorCallback, permissions.RECORD_AUDIO);
      } else {

        var recognition = new SpeechRecognition();
        recognition.onresult = function(event) {
            if (event.results.length > 0) {
                $scope.recognizedText = event.results[0][0].transcript;
                $scope.$apply()
            }
        };
        recognition.start();
        
      }
    }


  };
})
