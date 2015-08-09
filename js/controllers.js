angular.module('starter.controllers', ['ionicLazyLoad'])

.controller('AppCtrl', function($scope) {
	var app = this;
	app.currentPod = null;
	app.isPlaying = false;


  	var vid = document.getElementById("player");

	app.togglePlay = function() {
		app.isPlaying = !app.isPlaying;
		if (!app.isPlaying)
			vid.pause();
		else 
			vid.play();
	    //$scope.$apply();
	}


	vid.onplay = function() {
	    console.log("The video has started to play",this);
	    // app.currentPod=this;
	    app.isPlaying=true;
	    $scope.$apply();
	};
	vid.onpause = function() {
	    app.isPlaying=false;
	    $scope.$apply();
	};
})

.controller('DownCtrl', function($scope, $window, $ionicHistory) {

	var allpods = angular.fromJson($window.sessionStorage.pods);
	$scope.pods = [allpods[50],allpods[51],allpods[54]];
})

.controller('ChatsCtrl', function($scope, $http, $window, Chats) {
  //$scope.chats = Chats.all();
  $scope.pods = [];
   //$scope.init = function() {
   	if ($window.sessionStorage.pods) {
   		// use stored. todo refresh if old + online
   		$scope.pods = angular.fromJson($window.sessionStorage.pods);


   	} else {
        $http.get("http://www.richroll.com/feed/RRPodcastRSS/")
        //$http.get("pods.xml") // local
            .success(function(data) {
                console.log("got the data!");
                var json = xmlToJSON.parseString(data);
		   		console.log("got stored pods");
		   		var json = json.rss[0].channel[0].item; // get them items!
		   		var pods = [];
		   		var total = json.length;
		   		for (var i = total - 1; i >= 0; i--) {
		   			var p = json[i];
		   			pods.unshift({ // reverse
		   			  id: i,
		   			  num: total-i,
		              name: p.title[0]._text,
		              img: p.image[0]._text,
		              long: p.summary[0]._text,
		              short: p.subtitle[0]._text,
		              mp3: p.enclosure[0]._attr.url._value,
		              date: p.pubDate[0]._text,
		              duration: p.duration && p.duration[0] && p.duration[0]._text || "",
		   			});
		   		};
		   		//console.log(pods);
		   		$scope.pods = pods;
                $window.sessionStorage.pods = JSON.stringify(pods);
                //var json = xmlToJSON.parseString(data);
            })
            .error(function(data) {
                console.log("ERROR: " + data);
            });
   	
   	}
    //}
})

.controller('ChatDetailCtrl', function($scope, $window, $stateParams, Chats) {
  var vm = this;
  var pods = angular.fromJson($window.sessionStorage.pods); // or store in root scope?
  
  $scope.app.currentPod = vm.pod = pods[$stateParams.chatId];
  var vid = document.getElementById("player");
  vid.src = vm.pod.mp3;

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
